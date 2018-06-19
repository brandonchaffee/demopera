pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract Demopera is StandardToken {
    constructor(uint256 supply) public {
        totalSupply_ = supply;
        balances[msg.sender] = supply;
    }

    mapping(address => Organization) public orgs;

    struct Task {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => uint256) contributionOf;
        Submission[] submissions;
    }

    struct Submission {
        bytes32 details;
        address creator;
    }

    struct Project {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Task[] tasks;
    }

    struct Organization {
        bytes32 details;
        uint256 totalContributions;
        mapping(address => bool) isAdmin;
        mapping(address => uint256) contributionOf;
        Project[] projects;
    }

    modifier isOrganizationAdmin(address _org) {
        require(orgs[_org].isAdmin[msg.sender]);
        _;
    }

    modifier isProjectAdmin(address _org, uint256 _project) {
        require(orgs[_org].projects[_project].isAdmin[msg.sender]);
        _;
    }

    //Creation
    function createOrganization(bytes32 _details) public {
        Organization storage o = orgs[msg.sender];
        o.details = _details;
        o.isAdmin[msg.sender] = true;
    }

    function createProject(
        address _org,
        bytes32 _details
    ) isOrganizationAdmin(_org) public returns(uint256){
        Organization storage o = orgs[_org];
        uint256 projectID = o.projects.length++;
        o.projects[projectID].details = _details;
        o.projects[projectID].isAdmin[msg.sender] = true;
        return projectID;
    }

    function createTask(
        bytes32 _details,
        uint256 _project,
        address _org
    ) isProjectAdmin(_org, _project) public returns(uint256) {
        Project storage p = orgs[_org].projects[_project];
        uint256 taskID = p.tasks.length++;
        p.tasks[taskID].details = _details;
        return taskID;
    }

    function createSubmission(
        bytes32 _details,
        uint256 _task,
        uint256 _project,
        address _org
    ) public returns(uint256) {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        uint256 submissionID = t.submissions.length++;
        t.submissions[submissionID].details = _details;
        t.submissions[submissionID].creator = msg.sender;
        return submissionID;
    }

    //Administrative
    function setOrgAdminStatus(address _admin, bool _status) public {
        orgs[msg.sender].isAdmin[_admin] = _status;
    }

    function setProjectAdminStatus(
        address _org,
        uint256 _project,
        address _admin,
        bool _status
    ) isOrganizationAdmin(_org) public {
        orgs[_org].projects[_project].isAdmin[_admin] = _status;
    }

    //Financials
    function contributeToOrganization(uint256 _amount, address _org) public {
        require(balances[msg.sender] >= _amount);
        Organization storage o = orgs[_org];
        o.contributionOf[msg.sender] = _amount;
        o.totalContributions = o.totalContributions.add(_amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
    }

    function contributeToProject(
        uint256 _amount,
        address _org,
        uint256 _project
    ) public {
        require(balances[msg.sender] >= _amount);
        Project storage p = orgs[_org].projects[_project];
        p.contributionOf[msg.sender] = _amount;
        p.totalContributions = p.totalContributions.add(_amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
    }

    function contributeToTask(
        uint256 _amount,
        address _org,
        uint256 _project,
        uint256 _task
    ) public {
        require(balances[msg.sender] >= _amount);
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        t.contributionOf[msg.sender] = _amount;
        t.totalContributions = t.totalContributions.add(_amount);
        balances[msg.sender] = balances[msg.sender].sub(_amount);
    }

    function withdrawContribution() public {
        
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
        balances[submitter] = balances[submitter].add(_amount);
        t.totalContributions = t.totalContributions.sub(_amount);
    }

    function distributeToProject(
        address _org,
        uint256 _project,
        uint256 _amount
    ) isOrganizationAdmin(_org) public {
        Organization storage o = orgs[_org];
        require(o.totalContributions >= _amount);
        o.totalContributions = o.totalContributions.sub(_amount);
        Project storage p = o.projects[_project];
        p.totalContributions = p.totalContributions.add(_amount);
        p.contributionOf[msg.sender] = _amount;
    }

    function distributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) isProjectAdmin(_org, _project) public {
        Project storage p = orgs[_org].projects[_project];
        require(p.totalContributions >= _amount);
        p.totalContributions = p.totalContributions.sub(_amount);
        Task storage t = p.tasks[_task];
        t.totalContributions = t.totalContributions.add(_amount);
        t.contributionOf[msg.sender] = _amount;
    }
}
