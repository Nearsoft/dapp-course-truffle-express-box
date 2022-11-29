// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.25 <0.9.0;

// Contract name MetaCoin
contract MetaCoin {
    // Key - Value map structure (address - amount)
	mapping (address => uint) balances;  

    // Event that emits logs on smart contract calls. Logging: From, To and Value of the transfer transaction.
	event Transfer(address indexed _from, address indexed _to, uint256 _value); 

    // Constructor of the smart contract that sets the balance of the creator to 10,000 coins.
	constructor() {
		balances[tx.origin] = 10000;
	}

    // Function that send an amount of coins to a receiver account. 
    // Returns if the balance of the sender is sufficient for the transfer.
	function sendCoin(address receiver, uint amount) public returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		balances[receiver] += amount;
		emit Transfer(msg.sender, receiver, amount);
		return true;
	}

    // Function that retrieves the balance of an account on the balances mapping.
	function getBalance(address addr) public view returns(uint) {
		return balances[addr];
	}
}
