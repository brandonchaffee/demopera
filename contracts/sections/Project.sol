pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Project is EscrowToken  {
    modifier isProjectAdmin(address _org, uint256 _project) {
        require(orgs[_org].projects[_project].isAdmin[msg.sender]);
        _;
    }

    function createTask(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isProjectAdmin(_org, _project) public returns(uint256) {
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
    ) isProjectAdmin(_org, _project) validDetail(_details) public {
        Project storage p = orgs[_org].projects[_project];
        p.tasks[_task].details = _details;
    }

    function distributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) isProjectAdmin(_org, _project) public {
        Project storage p = orgs[_org].projects[_project];
        require(p.contributionTotal >= _amount);
        p.contributionTotal = p.contributionTotal.sub(_amount);
        p.childContributions = p.childContributions.add(_amount);
        Task storage t = p.tasks[_task];
        t.contributionTotal = t.contributionTotal.add(_amount);
        t.contributionOf[msg.sender] = _amount;
    }

    function disbursePayment(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission,
        uint256 _amount
    ) isProjectAdmin(_org, _project) public {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        address submitter = t.submissions[_submission].creator;
        depositTo(_amount, submitter);
        t.contributionTotal = t.contributionTotal.sub(_amount);
    }
}
