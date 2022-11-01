import { ethers } from "hardhat";
import { ERC20Mintable__factory } from "../typechain-types";

async function main() {
  const deployerSigner = (await ethers.getSigners())[0];
  const deployerAddress = deployerSigner.address;

  // const ERC20Mintable = await ethers.getContractFactory("ERC20Mintable");
  // const token = await ERC20Mintable.deploy();
  // await token.deployed();
  const tokenAddress = '0xDb88Df5bE6285d2d6f6B4645884C229B73df9799';
  const erc20MintableABI = [
    'function mint(address,uint256) returns (bool)',
    'function transfer(address,uint256) returns (bool)',
    'function balanceOf(address) returns (uint256)'
  ];
  const token = new ethers.Contract(tokenAddress, erc20MintableABI, deployerSigner);

  console.log(`Token deployed to ${token.address}`);

  // Mint funds to user
  // const mintTx = await token.mint(deployerAddress, 1000);
  // console.log('Mint tx: ', mintTx.hash);
  // await mintTx.wait();
  // Confirmed mint tx: 0x49f83f88f75f4c329e4e7e38b1611977c50cc700a00f9c5c39cdb13628e7c749

  const userBalanceAfter = await token.balanceOf(deployerAddress);

  const receiver = '0x803554C9cB72227D88B56495D3E92f96aD589B09';
  const transferTx = await token.transfer(receiver, 10);
  await transferTx.wait();
  // Confirmed tx hash: 0xff2487c7528c9ac491a380589c19a4b2ae2f9b918f1b59360bb2950ec77707cb
  const transferReceiverBalanceAfter = await token.balanceOf(receiver);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
