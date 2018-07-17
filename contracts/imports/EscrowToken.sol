pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "./GenericStorage.sol";

contract EscrowToken is StandardToken, GenericStorage {
	// ETf1 (Appendix)
	function hasSufficientBalance(uint256 _amount) public view returns(bool){
		require(balances[msg.sender] >= _amount);
	}

	event Withdrawn(address indexed from, uint256 amount);

	// ETf2 (Appendix)
	function withdrawFrom(uint256 _amount, address _target) internal {
		balances[_target] = balances[_target].sub(_amount);
		emit Withdrawn(_target, _amount);
	}
	event Deposited(address indexed to, uint256 amount);

	// ETf3 (Appendix)
	function depositTo(uint256 _amount, address _target) internal {
        balances[_target] = balances[_target].add(_amount);
		emit Deposited(_target, _amount);
	}
}
