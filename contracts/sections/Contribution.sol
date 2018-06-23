pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Contribution is EscrowToken  {

    function contributeToOrganization(
        address _org,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Organization storage o = orgs[_org];
        o.contributionOf[msg.sender].self =
        o.contributionOf[msg.sender].self.add(_amount);
        o.contributionTotal = o.contributionTotal.add(_amount);
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
        p.contributionOf[msg.sender].self =
        p.contributionOf[msg.sender].self.add(_amount);
        o.contributionOf[msg.sender].child =
        o.contributionOf[msg.sender].child.add(_amount);
        p.contributionTotal = p.contributionTotal.add(_amount);
        o.childContributions = o.childContributions.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function contributeToTask(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        hasSufficientBalance(_amount);
        Project storage p = orgs[_org].projects[_project];
        Task storage t = p.tasks[_task];
        t.contributionOf[msg.sender].self =
        t.contributionOf[msg.sender].self.add(_amount);
        p.contributionOf[msg.sender].child =
        p.contributionOf[msg.sender].child.add(_amount);
        t.contributionTotal = t.contributionTotal.add(_amount);
        p.childContributions = p.childContributions.add(_amount);
        withdrawFrom(_amount, msg.sender);
    }

    function recallOrgContribution(
        address _org,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        require(o.contributionOf[msg.sender].self >= _amount);
        require(o.contributionTotal >= _amount);
        o.contributionTotal = o.contributionTotal.sub(_amount);
        o.contributionOf[msg.sender].self =
        o.contributionOf[msg.sender].self.sub(_amount);
        depositTo(_amount, msg.sender);
    }

    function recallProjectContribution(
        address _org,
        uint256 _project,
        uint256 _amount
    ) public {
        Organization storage o = orgs[_org];
        Project storage p = o.projects[_project];
        require(p.contributionOf[msg.sender].self >= _amount);
        require(p.contributionTotal >= _amount);
        p.contributionTotal = p.contributionTotal.sub(_amount);
        o.childContributions = o.childContributions.sub(_amount);
        p.contributionOf[msg.sender].self =
        p.contributionOf[msg.sender].self.sub(_amount);
        o.contributionOf[msg.sender].child =
        o.contributionOf[msg.sender].child.sub(_amount);
        depositTo(_amount, msg.sender);
    }

    function recallTaskContribution(
        address _org,
        uint256 _project,
        uint256 _task,
        uint256 _amount
    ) public {
        Project storage p = orgs[_org].projects[_project];
        Task storage t = p.tasks[_task];
        require(t.contributionOf[msg.sender].self >= _amount);
        require(t.contributionTotal >= _amount);
        t.contributionTotal = t.contributionTotal.sub(_amount);
        p.childContributions = p.childContributions.sub(_amount);
        t.contributionOf[msg.sender].self =
        t.contributionOf[msg.sender].self.sub(_amount);
        p.contributionOf[msg.sender].child =
        p.contributionOf[msg.sender].child.sub(_amount);
        depositTo(_amount, msg.sender);
    }
}
