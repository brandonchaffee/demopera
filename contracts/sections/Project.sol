pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Project is EscrowToken  {
    function modifyProject(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isAdmin(_org) validDetail(_details) public {
        orgs[_org].projects[_project].details = _details;
    }

    function createTask(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isAdmin(_org) public returns(uint256) {
        Project storage p = orgs[_org].projects[_project];
        uint256 taskID = p.tasks.length++;
        p.tasks[taskID].details = _details;
        return taskID;
    }

    function modifyTask(
        address _org,
        uint256 _project,
        uint256 _task,
        bytes32 _details
    ) isAdmin(_org) validDetail(_details) public {
        Project storage p = orgs[_org].projects[_project];
        p.tasks[_task].details = _details;
    }

    function distributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) isAdmin(_org) public {
        Project storage p = orgs[_org].projects[_project];
        Task storage t = p.tasks[_task];
        require(p.total >= _amount);
        p.total = p.total.sub(_amount);
        t.total = t.total.add(_amount);
        t.distributed = t.distributed.add(_amount);
    }

    function recallTaskDistribution(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) isAdmin(_org) public {
        Project storage p = orgs[_org].projects[_project];
        Task storage t = p.tasks[_task];
        //Can only recall amount that was from distribution
        require(t.distributed >= _amount);
        //Can only recall amount if it has not been collected from total
        require(t.total >= _amount);
        t.distributed = t.distributed.sub(_amount);
        t.total = t.total.sub(_amount);
        p.total = p.total.add(_amount);
    }

    function disbursePayment(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission,
        uint256 _amount
    ) isAdmin(_org) public {
        Task storage t =  orgs[_org].projects[_project].tasks[_task];
        require(t.total >= _amount);
        address submitter = t.submissions[_submission].creator;
        t.payments[submitter] = Payment(_amount, now + paymentLockout);
    }

    function recallPayment(
        address _org,
        uint256 _project,
        uint256 _task,
        address _submitter,
        uint256 _amount
    ) isAdmin(_org) public {
        Payment storage p =
        orgs[_org].projects[_project].tasks[_task].payments[_submitter];
        require(p.amount >= _amount);
        p.amount = p.amount.sub(_amount);
    }
}
