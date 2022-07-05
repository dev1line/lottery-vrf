// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface INFTLotteryPool {
    function initialize(
        address _prizeAddress,
        uint256 _prizeId,
        uint64 _startDate,
        uint64 _endDate,
        uint32 _minTicketsToSell,
        uint32 _maxTickets,
        uint32 _maxTicketsPerAddress,
        uint256 _ticketPrice
    ) external;

    function transferOwnership(address newOwner) external;
}

contract NFTLotteryPoolFactory is Ownable {
    using SafeERC20 for IERC20;

    address public immutable linkAddress;
    address public immutable distributorAddress;
    uint256 public immutable fee;

    uint256 public poolFee = 0.01 ether;
    address public template;

    event LotteryDeployed(address a, address deployer);

    constructor(
        address _distributorAddress,
        address _linkAddress,
        uint256 _fee,
        address _template
    ) {
        linkAddress = _linkAddress;
        distributorAddress = _distributorAddress;
        fee = _fee;
        template = _template;
    }

    function createNFTLotteryPool(
        bytes32 salt,
        address _prizeAddress,
        uint256 _prizeId,
        uint64 _startDate,
        uint64 _endDate,
        uint32 _minTicketsToSell,
        uint32 _maxTickets,
        uint32 _maxTicketsPerAddress,
        uint256 _ticketPrice
    ) external payable returns (address) {
        require(msg.value >= poolFee, "Pay fee");
        INFTLotteryPool pool = INFTLotteryPool(
            ClonesUpgradeable.cloneDeterministic(template, salt)
        );
        pool.initialize(
            _prizeAddress,
            _prizeId,
            _startDate,
            _endDate,
            _minTicketsToSell,
            _maxTickets,
            _maxTicketsPerAddress,
            _ticketPrice
        );

        // Transfers ownership of pool to caller
        pool.transferOwnership(msg.sender);

        // // Approve
        IERC721(_prizeAddress).approve(address(pool), _prizeId);
        // // Escrows the LINK and NFT prize
        IERC721(_prizeAddress).safeTransferFrom(
            address(this),
            address(pool),
            _prizeId
        );
        IERC20(linkAddress).safeTransferFrom(msg.sender, address(pool), fee);

        emit LotteryDeployed(address(pool), msg.sender);
        return address(pool);
    }

    function getLotteryAddress(bytes32 salt) public view returns (address) {
        return ClonesUpgradeable.predictDeterministicAddress(template, salt);
    }

    function updatePoolFee(uint256 f) public onlyOwner {
        poolFee = f;
    }

    function claimETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
