pragma solidity ^0.4.23;

contract Demopera {
    constructor() public {

    }

    mapping(address => Organization) public orgs;

    struct Task {
        bytes32 details;
        mapping(address => uint) contributions;
        Submission[] submissions;
    }

    struct Submission {
        bytes32 details;
        address creator;
    }

    struct Project {
        bytes32 details;
        mapping(address => bool) isAdmin;
        Task[] tasks;
    }

    struct Organization {
        bytes32 details;
        mapping(address => bool) isAdmin;
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
    function createOrg(bytes32 _details) public {
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
    function contributeToOrganization() public {}
    function contributeToProject() public {}
    function contributeToTask() public {}
    function disbursePayment() public {}
}
