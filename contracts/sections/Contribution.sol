pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Contribution is EscrowToken  {

    function contributeToOrganization(
        address _org,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Organization storage o = orgs[_org];
        o.total = o.total.add(_amount);
        o.contributionOf[msg.sender] =
        o.contributionOf[msg.sender].add(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].add(_amount);
        o.stakes = o.stakes.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function contributeToProject(
        address _org,
        uint256 _project,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Organization storage o = orgs[_org];
        Project storage p = o.projects[_project];
        p.total = p.total.add(_amount);
        p.contributionOf[msg.sender] =
        p.contributionOf[msg.sender].add(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].add(_amount);
        o.stakes = o.stakes.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function contributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Organization storage o = orgs[_org];
        Task storage t = o.projects[_project].tasks[_task];
        t.total = t.total.add(_amount);
        t.contributionOf[msg.sender] =
        t.contributionOf[msg.sender].add(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].add(_amount);
        o.stakes = o.stakes.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    //Recall Contribution
    function recallOrganizationContribution(
        address _org,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        //Not more than contributed by sender
        require(o.contributionOf[msg.sender] >= _amount);
        //Has not been distributed
        require(o.total >= _amount);
        o.contributionOf[msg.sender] =
        o.contributionOf[msg.sender].sub(_amount);
        o.total = o.total.sub(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].sub(_amount);
        o.stakes = o.stakes.sub(_amount);
        depositTo(_amount, msg.sender);
    }

    function recallProjectContribution(
        address _org,
        uint256 _project,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        Project storage p = orgs[_org].projects[_project];
        //Not more than contributed by sender
        require(p.contributionOf[msg.sender] >= _amount);
        //Still has enough after distribution
        require(p.total >= _amount);
        p.total = p.total.sub(_amount);
        p.contributionOf[msg.sender] =
        p.contributionOf[msg.sender].sub(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].sub(_amount);
        o.stakes = o.stakes.sub(_amount);
        depositTo(_amount, msg.sender);
    }

    function recallTaskContribution(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        //Not more than contributed by sender
        require(t.contributionOf[msg.sender] >= _amount);
         //Still has enough after distribution
        require(t.total >= _amount);
        t.total = t.total.sub(_amount);
        t.contributionOf[msg.sender] =
        t.contributionOf[msg.sender].sub(_amount);
        o.stakeOf[msg.sender] = o.stakeOf[msg.sender].sub(_amount);
        o.stakes = o.stakes.sub(_amount);
        depositTo(_amount, msg.sender);
    }
}
