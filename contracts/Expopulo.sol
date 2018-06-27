pragma solidity ^0.4.23;

import "./sections/Organization.sol";
import "./sections/Project.sol";
import "./sections/Submission.sol";
import "./sections/Contribution.sol";
import "./sections/Moderation.sol";
import "./imports/Gettable.sol";

contract Expopulo is
    Organization,
    Project,
    Submission,
    Contribution,
    Moderation,
    Gettable
{
    constructor(uint256 supply, uint256 lockout) public {
        totalSupply_ = supply;
        balances[msg.sender] = supply;
        paymentLockout = lockout;
    }
}
