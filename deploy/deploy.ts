import { Wallet, Provider, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

export default async function (hre: HardhatRuntimeEnvironment) {
  // Initialize the wallet.
  const provider = new Provider(hre.userConfig.zkSyncDeploy?.zkSyncNetwork);
  const wallet = new Wallet(process.env.PRIVATE_KEY);
  console.log('wallet address: ', wallet.address);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const artifact = await deployer.loadArtifact("ERC20Mintable");

  // Estimate contract deployment fee
  const deploymentFee = await deployer.estimateDeployFee(artifact, []);
  console.log('deploy fee: ', deploymentFee.toString());

  // Deposit funds to L2
  const depositHandle = await deployer.zkWallet.deposit({
    to: deployer.zkWallet.address,
    token: utils.ETH_ADDRESS,
    amount: deploymentFee.mul(2),
  });
  // Wait until the deposit is processed on zkSync
  await depositHandle.wait();
  console.log('sent funds through bridge');

  // Deploy this contract. The returned object will be of a `Contract` type, similarly to ones in `ethers`.
  // `greeting` is an argument for contract constructor.
  const parsedFee = ethers.utils.formatEther(deploymentFee.toString());
  console.log(`The deployment is estimated to cost ${parsedFee} ETH`);

  const token = await deployer.deploy(artifact);
  console.log('deployed token');

  //obtain the Constructor Arguments
  console.log("constructor args:" + token.interface.encodeDeploy());

  // Show the contract info.
  const contractAddress = token.address;
  console.log(`${artifact.contractName} was deployed to ${contractAddress}`);

  // Mint tokens to self
  const mintTx = await token.mint(wallet.address, 1000);
  console.log('Mint tx: ', mintTx.hash);
  await mintTx.wait();

  // Send tokens to another user
  const receiver = '0x803554C9cB72227D88B56495D3E92f96aD589B09';
  const transferTx = await token.transfer(receiver, 10);
  console.log('Transfer tx: ', transferTx.hash);
  await transferTx.wait();
  console.log('Done');
}