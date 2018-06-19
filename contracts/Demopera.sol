pragma solidity ^0.4.23;

import './sections/Organization.sol';
import './sections/Project.sol';
import './sections/Submission.sol';
import './sections/Contribution.sol';

contract Demopera is Organization, Project, Submission, Contribution  {
    constructor(uint256 supply) public {
        totalSupply_ = supply;
        balances[msg.sender] = supply;
    }
}
