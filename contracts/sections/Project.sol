pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Project is EscrowToken  {
    modifier isGeneralAdmin(address _org, uint256 _project) {
        require(orgs[_org].admin[msg.sender].isValid ||
            orgs[_org].projects[_project].admin[msg.sender].isValid);
        _;
    }

    function modifyProject(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isGeneralAdmin(_org, _project) validDetail(_details) public {
        orgs[_org].projects[_project].details = _details;
    }

    function setProjectAdminStatus(
        address _org,
        uint256 _project,
        address _admin,
        bool _status
    ) isGeneralAdmin(_org, _project) public {
        orgs[_org].projects[_project].admin[_admin].isValid = _status;
    }

    function createTask(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isGeneralAdmin(_org, _project) public returns(uint256) {
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
    ) isGeneralAdmin(_org, _project) validDetail(_details) public {
        Project storage p = orgs[_org].projects[_project];
        p.tasks[_task].details = _details;
    }

    function distributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) isGeneralAdmin(_org, _project) public {
        Project storage p = orgs[_org].projects[_project];
        require(p.contributionTotal >= _amount);
        p.contributionTotal = p.contributionTotal.sub(_amount);
        p.childContributions = p.childContributions.add(_amount);
        Task storage t = p.tasks[_task];
        t.contributionTotal = t.contributionTotal.add(_amount);
        t.contributionOf[msg.sender].self =
        t.contributionOf[msg.sender].self.add(_amount);
        p.contributionOf[msg.sender].child =
        p.contributionOf[msg.sender].child.add(_amount);
    }

    /* function recallDistributionFromTask(
        address _org,
        uint256 _project,
        uint256 _task,
        address _target
    ) isGeneralAdmin(_org, _project) isGeneralAdmin(_org, _target) public {
        Project storage p = orgs[_org].projects[_project];
        p.contributionTotal = p.contributionTotal.add(t.contributionOf[msg.sender].self)
        t.con tr
        t.contributionOf[msg.sender].self = 0;
        p.contributionOf[msg.sender].child = 0;
    } */

    function disbursePayment(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission,
        uint256 _amount
    ) isGeneralAdmin(_org, _project) public {
        Project storage p = orgs[_org].projects[_project];
        Task storage t = p.tasks[_task];
        require(t.contributionTotal >= _amount);
        address submitter = t.submissions[_submission].creator;
        t.payments[submitter] = Payment(_amount, now + paymentLockout);
    }
}
