const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers, upgrades } = require("hardhat");

describe("token:", () => {
  beforeEach(async () => {
    MAX_LIMIT =
      "115792089237316195423570985008687907853269984665640564039457584007913129639935";
    TOTAL_SUPPLY = "1000000000000000000000000000000";
    ZERO_ADDR = "0x0000000000000000000000000000000000000000";
    accounts = await ethers.getSigners();
    owner = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    treasury = accounts[3];

    NFT = await ethers.getContractFactory("NFTCreator");
    nft = await upgrades.deployProxy(NFT, [
      owner.address,
      "Non-Fungiable Token",
      "NFT",
      treasury.address,
      250,
    ]);

    const Distributor = await ethers.getContractFactory("Distributor");
    distributor = await Distributor.deploy(
      process.env.VRF_COORDINATOR,
      process.env.LINK,
      process.env.KEY_HASH
    );
    console.log("distributor deployed in:", distributor.address);

    NFTLotteryPool = await ethers.getContractFactory("NFTLotteryPool");
    nftLotteryPool = await NFTLotteryPool.deploy();
    console.log("nftLotteryPool deployed in:", nftLotteryPool.address);

    const NFTLotteryPoolFactory = await ethers.getContractFactory(
      "NFTLotteryPoolFactory"
    );
    nftLotteryPoolFactory = await NFTLotteryPoolFactory.deploy(
      distributor.address,
      process.env.LINK,
      process.env.FEE,
      nftLotteryPool.address
    );

    console.log(
      "nftLotteryPoolFactory deployed in:",
      nftLotteryPoolFactory.address
    );
  });

  describe("deployment:", async () => {
    it("check all:", async () => {
      console.log("hashbytes32:", ethers.utils.formatBytes32String("2"));
      // await nft.mint(user1.address);
      // await nft.connect(user1).approve(nftLotteryPoolFactory.address, 0);
      // const params = {
      //   salt: ethers.utils.formatBytes32String("1"),
      //   _prizeAddress: nft.address,
      //   _prizeId: 0,
      //   _startDate: 1656223720,
      //   _endDate: 1656224720,
      //   _minTicketsToSell: 1,
      //   _maxTickets: 10,
      //   _maxTicketsPerAddress: 5,
      //   _ticketPrice: 1000000,
      // };
      // const prize = await NFT.attach(params._prizeAddress);
      // await prize
      //   .connect(user1)
      //   .approve(nftLotteryPoolFactory.address, params._prizeId);
      // await prize
      //   .connect(user1)
      //   .transferFrom(
      //     user1.address,
      //     nftLotteryPoolFactory.address,
      //     params._prizeId
      //   );
      // const poolPair = await nftLotteryPoolFactory
      //   .connect(user1)
      //   .createNFTLotteryPool(
      //     params.salt,
      //     params._prizeAddress,
      //     params._prizeId,
      //     params._startDate,
      //     params._endDate,
      //     params._minTicketsToSell,
      //     params._maxTickets,
      //     params._maxTicketsPerAddress,
      //     params._ticketPrice,
      //     { value: ethers.utils.parseEther("0.1") }
      //   );
      // await poolPair.wait();
      // console.log(poolPair);
    });
  });
});
