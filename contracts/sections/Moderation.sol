pragma solidity ^0.4.23;

import "../imports/EscrowToken.sol";

contract Moderation is EscrowToken {
    function voteToRemoveOrgAdmin(
        address _org,
        address _target
    ) public {
        Organization storage o = orgs[_org];
        uint256 votes = o.contributionOf[msg.sender].self +
        o.contributionOf[msg.sender].child;
        o.admin[_target].removalVotes =
        o.admin[_target].removalVotes.add(votes);
        o.admin[_target].isValid = o.admin[_target].removalVotes >
        (o.contributionTotal + o.childContributions);
    }
    function voteToRemoveProjectAdmin(
        address _org,
        uint256 _project,
        address _target
    ) public {
        Project storage p = orgs[_org].projects[_project];
        uint256 votes = p.contributionOf[msg.sender].self +
        p .contributionOf[msg.sender].child;
        p.admin[_target].removalVotes =
        p.admin[_target].removalVotes.add(votes);
        p.admin[_target].isValid = p.admin[_target].removalVotes >
        (p.contributionTotal + p.childContributions);
    }
/* 
    function revokePayment(){}

    function recallFrom */
}
