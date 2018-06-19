pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Contribution is EscrowToken  {

    function contributeToOrganization(
        address _org,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Organization storage o = orgs[_org];
        o.contributionOf[msg.sender] = _amount;
        o.totalContributions = o.totalContributions.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function contributeToProject(
        address _org,
        uint256 _project,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Project storage p = orgs[_org].projects[_project];
        p.contributionOf[msg.sender] = _amount;
        p.totalContributions = p.totalContributions.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function contributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        t.contributionOf[msg.sender] = _amount;
        t.totalContributions = t.totalContributions.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function recallOrgContribution(
        address _org,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        require(o.contributionOf[msg.sender] >= _amount);
        require(o.totalContributions >= _amount);
        o.totalContributions = o.totalContributions.sub(_amount);
        o.contributionOf[msg.sender] = 0;
        depositTo(_amount, msg.sender);
    }

    function recallProjectContribution(
        address _org,
        uint256 _project,
        uint256 _amount
    ) public {
        Project storage p = orgs[_org].projects[_project];
        require(p.contributionOf[msg.sender] >= _amount);
        require(p.totalContributions >= _amount);
        p.totalContributions = p.totalContributions.sub(_amount);
        p.contributionOf[msg.sender] = 0;
        depositTo(_amount, msg.sender);
    }

    function recallTaskContribuiton(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        Task storage t = orgs[_org].projects[_project].tasks[_task];
        require(t.contributionOf[msg.sender] >= _amount);
        require(t.totalContributions >= _amount);
        t.totalContributions = t.totalContributions.sub(_amount);
        t.contributionOf[msg.sender] = 0;
        depositTo(_amount, msg.sender);
    }
}
