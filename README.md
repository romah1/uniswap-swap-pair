# Uniswap V2 Token Swap Example

This project demonstrates how to deploy two ERC-20 tokens to blockchain and swap them through Uniswap V2 on mainnet fork

## Structure:
`contracts` directory contains Solidity contracts for Bar and Foo ERC-20 tokens

`scripts/const.ts` contains UniswapRouterV2 address, abi and bytecode

`UniswapRouterV2Address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"`

`scripts/swap.ts` contains main script logic:

1. Deploy `FooToken` and `BarToken` to blockchain
2. Add liquidity for Foo and Bar tokens with `UniswapRouterV2`
3. Swap tokens by calling `swapExactTokensForTokens` on `UniswapRouterV2`

## How to run:
```
npm i
npx hardhat run scripts/swap.ts
```

## Example output:
```
Liquidity provider address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
User address: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Uniswap router address: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
FooToken deployed at 0x90c84237fDdf091b1E63f369AF122EB46000bc70
BarToken deployed at 0x3D63c50AD04DD5aE394CAB562b7691DD5de7CF6f
5000 FooToken transferred to user
5000 FooToken transfer appoved to uniswap router
5000 BarToken transfer appoved to uniswap router
5000 liquidity added to FooToken and BarToken pair
User FooToken balance before swap: 5000
User BarToken balance before swap: 0
Swap of 3000 FooToken -> BarToken succeed
User FooToken balance: 2000
User BarToken balance: 1871
```
