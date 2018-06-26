pragma solidity ^0.4.23;

import "./GenericStorage.sol";

contract Gettable is GenericStorage  {

    //Structure Getter Functions
    function getProject(
        address _org,
        uint256 _project
    ) public view returns(bytes32, uint256, uint256, uint256) {
        Project storage p = orgs[_org].projects[_project];
        return (p.details, p.total, p.contributed, p.distributed);
    }

    function getTask(
        address _org,
        uint256 _project,
        uint256 _task
    ) public view returns(bytes32, uint256, uint256, uint256) {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        return (t.details, t.total, t.contributed, t.distributed);
    }

    function getSubmission(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _submission
    ) public view returns(bytes32, address) {
        Submission storage s =
        orgs[_org].projects[_project].tasks[_task].submissions[_submission];
        return (s.details, s.creator);
    }

    function getPayment(
        address _org,
        uint256 _project,
        uint256 _task,
        address _payee
    ) public view returns(uint256, uint256) {
        Payment storage p =
        orgs[_org].projects[_project].tasks[_task].payments[_payee];
        return (p.amount, p.unlockTime);
    }


    ////Depth Getter Functions
    //Admin
    function getAdminStatus(
        address _org,
        address _target
    ) public view returns(bool){
        return orgs[_org].admin[_target].isValid;
    }

    //Contributions
    function getOrgContribtuionOf(
        address _org,
        address _target
    ) public view returns(uint256){
        return orgs[_org].contributionOf[_target];
    }

    function getProjectContributionOf(
        address _org,
        uint256 _project,
        address _target
    ) public view returns(uint256){
        return orgs[_org].projects[_project].contributionOf[_target];
    }

    function getTaskContributionOf(
        address _org,
        uint256 _project,
        uint256 _task,
        address _target
    ) public view returns(uint256){
        return
        orgs[_org].projects[_project].tasks[_task].contributionOf[_target];
    }

    //Stake
    function getStakeOf(
        address _org,
        address _target
    ) public view returns(uint256) {
        return orgs[_org].stakeOf[_target];
    }
}
