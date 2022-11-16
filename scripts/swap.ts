import { ethers } from "hardhat";
import {UniswapRouterV2Bytecode, UniswapRouterV2Abi, UniswapRouterV2Address} from "./const"


async function main() {
  const FooBarTokensSupply = 1e8
  const fooBarLiquidity = 5000;
  const poolUserFooTokenBalance = 5000;
  const poolUserSwapAmount = 3000;
  const [liquidityProvider, poolUser] = await ethers.getSigners();

  console.log(`Liquidity provider address: ${liquidityProvider.address}`)
  console.log(`User address: ${poolUser.address}`)

  console.log(`Uniswap router address: ${UniswapRouterV2Address}`)

  const FooToken = await ethers.getContractFactory("FooToken", liquidityProvider)
  const BarToken = await ethers.getContractFactory("BarToken", liquidityProvider)

  const fooToken = await FooToken.deploy(FooBarTokensSupply)
  await fooToken.deployed()
  console.log(`FooToken deployed at ${fooToken.address}`)

  const barToken = await BarToken.deploy(FooBarTokensSupply)
  await barToken.deployed()
  console.log(`BarToken deployed at ${barToken.address}`)

  await fooToken.transfer(poolUser.address, poolUserFooTokenBalance);
  console.log(`${poolUserFooTokenBalance} FooToken transferred to user`)

  await fooToken.approve(UniswapRouterV2Address, fooBarLiquidity);
  console.log(`${fooBarLiquidity} FooToken transfer appoved to uniswap router`)

  await barToken.approve(UniswapRouterV2Address, fooBarLiquidity);
  console.log(`${fooBarLiquidity} BarToken transfer appoved to uniswap router`)

  const UniswapRouterContractFactory = await ethers.getContractFactory(UniswapRouterV2Abi, UniswapRouterV2Bytecode, liquidityProvider);
  const uniswapRouter = UniswapRouterContractFactory.attach(UniswapRouterV2Address);

  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  const blockTimestamp = block.timestamp;
  const deadline = blockTimestamp + 60*20;

  await uniswapRouter.addLiquidity(
    fooToken.address,
    barToken.address,
    fooBarLiquidity,
    fooBarLiquidity,
    0, // min amount of FooToken
    0, // min amount of BarToken
    liquidityProvider.address, // recipent of the liquidity tokens
    deadline
  )
  console.log(`${fooBarLiquidity} liquidity added to FooToken and BarToken pair`)

  const UserFooToken = await ethers.getContractFactory("FooToken", poolUser)
  const userFooToken = UserFooToken.attach(fooToken.address)
  await userFooToken.approve(UniswapRouterV2Address, poolUserSwapAmount);
  const UserUniswapRouterContractFactory = await ethers.getContractFactory(UniswapRouterV2Abi, UniswapRouterV2Bytecode, poolUser);
  const userUniswapRouter = UserUniswapRouterContractFactory.attach(UniswapRouterV2Address);


  const userFooTokenBalanceBeforeSwap = await fooToken.balanceOf(poolUser.address)
  const userBarTokenBalanceBeforeSwap = await barToken.balanceOf(poolUser.address)

  console.log(`User FooToken balance before swap: ${userFooTokenBalanceBeforeSwap}`)
  console.log(`User BarToken balance before swap: ${userBarTokenBalanceBeforeSwap}`)

  await userUniswapRouter.swapExactTokensForTokens(
    poolUserSwapAmount,
    0,
    [fooToken.address, barToken.address],
    poolUser.address,
    deadline
  )
  console.log(`Swap of ${poolUserSwapAmount} FooToken -> BarToken succeed`)
  const userFooTokenBalance = await fooToken.balanceOf(poolUser.address)
  const userBarTokenBalance = await barToken.balanceOf(poolUser.address)

  console.log(`User FooToken balance: ${userFooTokenBalance}`)
  console.log(`User BarToken balance: ${userBarTokenBalance}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
