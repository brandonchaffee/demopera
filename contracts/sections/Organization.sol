pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Organization is EscrowToken  {
    modifier isOrganizationAdmin(address _org) {
        require(orgs[_org].isAdmin[msg.sender]);
        _;
    }

    ///Creation of Organization
    function formOrganization(bytes32 _details) public {
        Organization storage o = orgs[msg.sender];
        o.details = _details;
        o.isAdmin[msg.sender] = true;
    }

    //Administration of Organization
    function setOrgAdminStatus(address _admin, bool _status) public {
        orgs[msg.sender].isAdmin[_admin] = _status;
    }

    //Organization Project Creation & Maintainence
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

    function modifyProject(
        address _org,
        uint256 _project,
        bytes32 _details
    ) isOrganizationAdmin(_org) public {
        Organization storage o = orgs[_org];
        o.projects[_project].details = _details;
    }

    function setProjectAdminStatus(
        address _org,
        uint256 _project,
        address _admin,
        bool _status
    ) isOrganizationAdmin(_org) public {
        orgs[_org].projects[_project].isAdmin[_admin] = _status;
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
}
