pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./GenericStorage.sol";

contract EscrowToken is StandardToken, GenericStorage {
	function hasSufficientBalance(uint256 _amount) public view returns(bool){
		require(balances[msg.sender] >= _amount);
	}

	function withdrawFrom(uint256 _amount, address _target) internal {
		balances[_target] = balances[_target].sub(_amount);
	}

	function depositTo(uint256 _amount, address _target) internal {
        balances[_target] = balances[_target].add(_amount);
	}
}
