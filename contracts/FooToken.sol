// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FooToken is ERC20 {
  constructor(uint supply) ERC20("FooToken", "FT") {
    _mint(msg.sender, supply);
  }
}