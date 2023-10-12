import { ethers } from "hardhat";

const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

async function main() {
  const WATTMock = await ethers.getContractFactory("WATTMock");
  const wattMock = await WATTMock.deploy("WATT", "WATT");
  await wattMock.deployed();
  console.log("WATTMock", wattMock.address);

  const WATTPaymaster = await ethers.getContractFactory("WATTPaymaster");
  const wattPaymaster = await WATTPaymaster.deploy(entryPointAddress, wattMock.address, 1);
  await wattPaymaster.deployed();
  console.log("WATTPaymaster", wattPaymaster.address);

  // setup paymaster
  const addStakeTx = await wattPaymaster.addStake(1, { value: 1 });
  await addStakeTx.wait();
  const depositTx = await wattPaymaster.deposit({ value: ethers.utils.parseEther("0.05") });
  await depositTx.wait();
  console.log("WATTPaymaster setup completed");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
