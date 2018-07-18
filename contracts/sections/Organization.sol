/*
    Documentation: https://expopulo.readthedocs.io
    Author: Brandon Chaffee
    License: MIT
*/

pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Organization is EscrowToken  {
    ///Creation of Organization
    event OrganizationFormed(address creator);

    // Of1 (Appendix)
    function formOrganization(bytes32 _details)
    validDetail(_details) public {
        Organization storage o = orgs[msg.sender];
        require(o.details == bytes32(0));
        o.details = _details;
        o.admin[msg.sender].isValid = true;
        emit OrganizationFormed(msg.sender);
    }

    // Of2 (Appendix)
    function modifyOrganization(
        address _org,
        bytes32 _details
    ) isAdmin(_org) validDetail(_details) public {
        orgs[_org].details = _details;
    }

    // Of3 (Appendix)
    function setAdminStatus(
        address _org,
        address _admin,
        bool _status
    ) isAdmin(_org) public {
        orgs[_org].admin[_admin].isValid = _status;
    }

    event ProjectCreated(address indexed creator, uint256 id);

    // Of4 (Appendix)
    function createProject(
        address _org,
        bytes32 _details
    ) isAdmin(_org) validDetail(_details) public returns(uint256){
        Organization storage o = orgs[_org];
        uint256 projectID = o.projects.length++;
        o.projects[projectID].details = _details;
        emit ProjectCreated(_org, projectID);
        return projectID;
    }

    // Of5 (Appendix)
    function distributeToProject(
        address _org,
        uint256 _project,
        uint256 _amount
    ) isAdmin(_org) public {
        Organization storage o = orgs[_org];
        Project storage p = o.projects[_project];
        require(o.total >= _amount);
        o.total = o.total.sub(_amount);
        p.distributed = p.distributed.add(_amount);
        p.total = p.total.add(_amount);
    }

    // Of6 (Appendix)
    function recallProjectDistribution(
        address _org,
        uint256 _project,
        uint256 _amount
    ) isAdmin(_org) public {
        Organization storage o = orgs[_org];
        Project storage p = o.projects[_project];
        //Can only recall amount that was from distribution
        require(p.distributed >= _amount);
        //Can only recall amount if it has not been collect from total
        require(p.total >= _amount);
        p.distributed = p.distributed.sub(_amount);
        p.total = p.total.sub(_amount);
        o.total = o.total.add(_amount);
    }
}
