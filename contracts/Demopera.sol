pragma solidity ^0.4.23;

import "./sections/Organization.sol";
import "./sections/Project.sol";
import "./sections/Submission.sol";
import "./sections/Contribution.sol";
import "./imports/Gettable.sol";

contract Demopera is Organization, Project, Submission, Contribution, Gettable
{
    constructor(uint256 supply) public {
        totalSupply_ = supply;
        balances[msg.sender] = supply;
    }
}
