pragma solidity ^0.4.23;

import "./GenericStorage.sol";

contract Gettable is GenericStorage  {

    //Structure Getter Functions
    function getProject(
        address _org,
        uint256 _project
    ) public view returns(bytes32, uint256, uint256) {
        Project storage p = orgs[_org].projects[_project];
        return (p.details, p.total, p.distributed);
    }

    function getTask(
        address _org,
        uint256 _project,
        uint256 _task
    ) public view returns(bytes32, uint256, uint256) {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        return (t.details, t.total, t.distributed);
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

    function getAdmin(
        address _org,
        address _target
    ) public view returns(bool, uint256, uint256) {
        Admin storage a = orgs[_org].admin[_target];
        return (a.isValid, a.enableVotes, a.disableVotes);
    }

    ////Depth Getter Functions
    //Admin
    function getAdminEnableVotesOf(
        address _org,
        address _target,
        address _sender
    ) public view returns(uint256) {
        return orgs[_org].admin[_target].enableVotesOf[_sender];
    }

    function getAdminDisableVotesOf(
        address _org,
        address _target,
        address _sender
    ) public view returns(uint256) {
        return orgs[_org].admin[_target].disableVotesOf[_sender];
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
