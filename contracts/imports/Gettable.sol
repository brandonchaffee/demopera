pragma solidity ^0.4.23;

import "./GenericStorage.sol";

contract Gettable is GenericStorage  {
    function getOrgAdminStatus(
        address _org,
        address _target
    ) public view returns(bool){
        return orgs[_org].isAdmin[_target];
    }

    function getProjectAdminStatus(
        address _org,
        uint256 _project,
        address _target
    ) public view returns(bool){
        return orgs[_org].projects[_project].isAdmin[_target];
    }

    function getOrgContribtuionOf(
        address _org,
        address _target
    ) public view returns(uint256){
        return orgs[_org].contributionOf[_target].self;
    }

    function getProjectContributionOf(
        address _org,
        uint256 _project,
        address _target
    ) public view returns(uint256){
        return orgs[_org].projects[_project].contributionOf[_target].self;
    }

    function getTaskContributionOf(
        address _org,
        uint256 _project,
        uint256 _task,
        address _target
    ) public view returns(uint256){
        return
        orgs[_org].projects[_project].tasks[_task].contributionOf[_target].self;
    }

    function getOrgChildContributionOf(
        address _org,
        address _target
    ) public view returns(uint256){
        return orgs[_org].contributionOf[_target].child;
    }

    function getProjectChildContributionsOf(
        address _org,
        uint256 _project,
        address _target
    ) public view returns(uint256){
        return orgs[_org].projects[_project].contributionOf[_target].child;
    }

    function getTotalOrgContribution(
        address _org
    ) public view returns(uint256){
        return orgs[_org].contributionTotal;
    }

    function getTotalProjectContribution(
        address _org,
        uint256 _project
    ) public view returns(uint256){
        return orgs[_org].projects[_project].contributionTotal;
    }

    function getTotalTaskContribution(
        address _org,
        uint256 _project,
        uint256 _task
    ) public view returns(uint256){
        return orgs[_org].projects[_project].tasks[_task].contributionTotal;
    }

    function getProjectDetails(
        address _org,
        uint256 _project
    ) public view returns(bytes32) {
        return orgs[_org].projects[_project].details;
    }

    function getTaskDetails(
        address _org,
        uint256 _project,
        uint256 _task
    ) public view returns(bytes32) {
        return orgs[_org].projects[_project].tasks[_task].details;
    }

    function getOrgChildContribution(
        address _org
    ) public view returns(uint256){
        return orgs[_org].childContributions;
    }

    function getProjectChildContribution(
        address _org,
        uint256 _project
    ) public view returns(uint256){
        return orgs[_org].projects[_project].childContributions;
    }

    function getSubmissionDetails(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission
    ) public view returns(bytes32) {
        return orgs[_org].projects[_project].tasks[_task].submissions
        [_submission].details;
    }

    function getPaymentUnlockTime(
        address _org,
        uint256 _project,
        uint256 _task,
        address _payee
    ) public view returns(uint256) {
        return
        orgs[_org].projects[_project].tasks[_task].payments[_payee].unlockTime;
    }

    function getPaymentAmount(
        address _org,
        uint256 _project,
        uint256 _task,
        address _payee
    ) public view returns(uint256) {
        return
        orgs[_org].projects[_project].tasks[_task].payments[_payee].amount;
    }
}
