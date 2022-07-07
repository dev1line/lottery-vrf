const hre = require("hardhat");
const contracts = require("../contracts-verify.json");

async function main() {
  try {
    await hre.run("verify:verify", {
      address: contracts.nft,
      contract: "contracts/NFTCreator.sol:NFTCreator",
    });
  } catch (err) {
    console.log("err :>> ", err);
  }

  try {
    await hre.run("verify:verify", {
      address: contracts.distributor,
      constructorArguments: [
        process.env.VRF_COORDINATOR,
        process.env.LINK,
        process.env.KEY_HASH,
      ],
      contract: "contracts/Distributor.sol:Distributor",
    });
  } catch (err) {
    console.log("err :>> ", err);
  }

  try {
    await hre.run("verify:verify", {
      address: contracts.nftLotteryPool,
      contract: "contracts/NFTLotteryPool.sol:NFTLotteryPool",
    });
  } catch (err) {
    console.log("err :>> ", err);
  }

  try {
    await hre.run("verify:verify", {
      address: contracts.nftLotteryPoolFactory,
      contract: "contracts/NFTLotteryPoolFactory.sol:NFTLotteryPoolFactory",
    });
  } catch (err) {
    console.log("err :>> ", err);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
