# Nexul-NXL-
Nexul (NXL) CRÉATRICE SABRINA AISSANI.
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/*
 Nexul Ultimate Impact V3 — NXL
 Auteur : S. Aissani
 Version finale optimisée et sécurisée
*/

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/ERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/Pausable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/security/ReentrancyGuard.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.8.0/contracts/token/ERC20/utils/SafeERC20.sol";

interface IRouter {
    function WETH() external pure returns (address);
}

contract NexulUltimateImpactV3 is ERC20, ERC20Permit, ERC20Votes, Ownable, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ===== CONFIG =====
    uint16 public constant MAX_TAX_BPS = 1000; // 10%
    uint16 public totalTaxBps = 50;            // 0.5%
    uint256 public constant VOTING_NORMALIZATION = 1_000;
    uint256 public constant MAX_TX_PERCENT = 2;
    uint256 public swapThreshold;
    address public guardian;
    address public treasury;
    address public charityWallet;
    IRouter public immutable router;
    bool public adaptiveTaxEnabled;
    uint8 public treasuryBuybackPct = 50;
    bool private inSwap;

    // ===== STRUCTURES =====
    struct TaxSplit { uint8 liquidity; uint8 burn; uint8 reward; uint8 charity; }
    TaxSplit public taxSplit = TaxSplit(50,30,15,5);
    struct Lock { uint256 amount; uint256 unlockTime; }

    // ===== MAPPINGS =====
    mapping(address => bool) public isMultisig;
    mapping(address => bool) private _isExcludedFromTax;
    mapping(address => bool) private _isBlacklisted;
    mapping(address => uint256) public lastTransfer;
    mapping(address => Lock) public locks;
    mapping(address => uint256) public votingPower;
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public userActionPoints;
    mapping(uint8 => uint256) public poolBalances;

    // ===== ENUMS =====
    enum Cause { Artisan, Sante, Environnement, Jeunesse, Sport, Benevolat, Animaux }

    // ===== STAKING VARS =====
    uint256 public totalVotingPower;
    uint256 public totalStaked;
    uint256 public rewardRatePerBlock;
    uint256 public rewardPerTokenStored;
    uint256 public lastUpdateBlock;
    uint16 public boostMaxBps = 2000; // +20%

    // ===== EVENTS =====
    event ActionPointsEarned(address indexed user, Cause cause, uint256 points);
    event PoolDistributed(Cause cause, uint256 totalAmount);
    event Locked(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event TaxApplied(address indexed from, address indexed to, uint256 amount, uint16 taxBps);
    event Burned(address indexed from, uint256 amount);

    // ===== MODIFIERS =====
    modifier onlyOwnerOrGuardian() { require(msg.sender==owner()||msg.sender==guardian,"Not authorized"); _; }
    modifier onlyMultisig() { require(isMultisig[msg.sender],"Not multisig"); _; }
    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateBlock = block.number;
        if(account!=address(0)){
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }
    modifier notBlacklisted(address account) { require(!_isBlacklisted[account],"Blacklisted"); _; }

    // ===== CONSTRUCTOR =====
    constructor(
        IRouter _router,
        uint256 _swapThreshold,
        address _guardian,
        address[] memory _multisigAdmins,
        address _treasury,
        address _charityWallet
    ) ERC20("Nexul Ultimate Impact V3","NXL")
      ERC20Permit("Nexul Ultimate Impact V3")
    {
        router = _router;
        swapThreshold = _swapThreshold;
        guardian = _guardian;
        treasury = _treasury;
        charityWallet = _charityWallet;
        for(uint i;i<_multisigAdmins.length;i++){
            isMultisig[_multisigAdmins[i]] = true;
        }
        _mint(msg.sender, 5_000_000_000 * 10**18); // Total supply 5 milliards
        _isExcludedFromTax[msg.sender] = true;
        _isExcludedFromTax[address(this)] = true;
        lastUpdateBlock = block.number;
    }

    // ===== ACTION POINTS =====
    function earnActionPoints(Cause cause,address user,uint256 pts) external onlyOwnerOrGuardian {
        userActionPoints[user] += pts;
        poolBalances[uint8(cause)] += pts;
        emit ActionPointsEarned(user,cause,pts);
    }
    function distributePool(Cause cause) external onlyOwnerOrGuardian {
        uint8 idx = uint8(cause);
        uint256 pool = poolBalances[idx];
        require(pool > 0, "No pool");
        poolBalances[idx] = 0;
        emit PoolDistributed(cause, pool);
    }

    // ===== LOCKING (veNXL) =====
    function createLock(uint256 amount,uint256 duration) external whenNotPaused notBlacklisted(msg.sender) {
        require(amount>0 && duration>=1 weeks && duration<=4*365 days,"invalid");
        Lock storage l = locks[msg.sender];
        require(l.amount==0,"lock exists");
        _transfer(msg.sender,address(this),amount);
        l.amount = amount;
        l.unlockTime = block.timestamp + duration;
        uint256 power = (amount*duration/1 days)/VOTING_NORMALIZATION;
        votingPower[msg.sender] = power;
        totalVotingPower += power;
        emit Locked(msg.sender,amount,l.unlockTime);
    }
    function withdrawLock() external whenNotPaused notBlacklisted(msg.sender) {
        Lock storage l = locks[msg.sender];
        require(l.amount>0 && block.timestamp>=l.unlockTime,"locked");
        uint256 amount = l.amount;
        uint256 power = votingPower[msg.sender];
        l.amount = 0;
        votingPower[msg.sender] = 0;
        totalVotingPower = totalVotingPower >= power ? totalVotingPower - power : 0;
        _transfer(address(this),msg.sender,amount);
        emit Withdrawn(msg.sender,amount);
    }

    // ===== STAKING =====
    function rewardPerToken() public view returns(uint256){
        if(totalStaked==0) return rewardPerTokenStored;
        uint256 blocks = block.number - lastUpdateBlock;
        return rewardPerTokenStored + (blocks*rewardRatePerBlock*1e18)/totalStaked;
    }
    function earned(address account) public view returns(uint256){
        uint256 base = (stakedBalance[account]*(rewardPerToken()-userRewardPerTokenPaid[account]))/1e18;
        if(totalVotingPower==0) return rewards[account]+base;
        uint256 votingShareBps = (votingPower[account]*10000)/totalVotingPower;
        uint256 boost = (base*votingShareBps*boostMaxBps)/(10000*10000);
        return rewards[account]+base+boost;
    }
    function stake(uint256 amount) external updateReward(msg.sender) whenNotPaused notBlacklisted(msg.sender) {
        require(amount>0,"Zero");
        totalStaked += amount;
        stakedBalance[msg.sender] += amount;
        _transfer(msg.sender,address(this),amount);
        emit Locked(msg.sender,amount,0);
    }
    function withdrawStake(uint256 amount) public updateReward(msg.sender) notBlacklisted(msg.sender){
        require(amount>0 && stakedBalance[msg.sender]>=amount,"Invalid");
        totalStaked -= amount;
        stakedBalance[msg.sender] -= amount;
        _transfer(address(this),msg.sender,amount);
        emit Withdrawn(msg.sender,amount);
    }
    function getReward() public updateReward(msg.sender) notBlacklisted(msg.sender){
        uint256 r = rewards[msg.sender];
        if(r>0){
            rewards[msg.sender] = 0;
            _transfer(address(this),msg.sender,r);
            emit RewardPaid(msg.sender,r);
        }
    }
    function exit() external {
        withdrawStake(stakedBalance[msg.sender]);
        getReward();
    }

    // ===== TRANSFERT AVEC TAX =====
    function _transfer(address from,address to,uint256 amount) internal override whenNotPaused notBlacklisted(from) notBlacklisted(to){
        require(amount<=(totalSupply()*MAX_TX_PERCENT)/100,"max tx");
        lastTransfer[from] = block.timestamp;
        if(_isExcludedFromTax[from] || _isExcludedFromTax[to] || totalTaxBps==0){
            super._transfer(from,to,amount);
            return;
        }
        uint16 tax = totalTaxBps;
        if(block.timestamp - lastTransfer[from] > 30 days && tax >= 1) tax /= 2;
        uint256 taxAmount = (amount*tax)/10000;
        uint256 remaining = amount - taxAmount;
        uint256 liq = (taxAmount*taxSplit.liquidity)/100;
        uint256 burn = (taxAmount*taxSplit.burn)/100;
        uint256 rew = (taxAmount*taxSplit.reward)/100;
        uint256 charityAmt = taxAmount - liq - burn - rew;
        if(liq>0) super._transfer(from,address(this),liq);
        if(rew>0) super._transfer(from,address(this),rew);
        if(charityAmt>0 && charityWallet!=address(0)) super._transfer(from,charityWallet,charityAmt);
        if(burn>0){ _burn(from,burn); emit Burned(from,burn); }
        super._transfer(from,to,remaining);
        emit TaxApplied(from,to,taxAmount,tax);
    }

    // ===== ADMIN =====
    function setTreasury(address t) external onlyOwner{ treasury=t; }
    function setCharity(address c) external onlyOwner{ charityWallet=c; }
    function excludeFromTax(address a,bool ex) external onlyOwner{ _isExcludedFromTax[a]=ex; }
    function setBlacklist(address a,bool s) external onlyOwner{ _isBlacklisted[a]=s; }
    function setTaxSplit(uint8 l,uint8 b,uint8 r,uint8 c) external onlyOwner{ require(l+b+r+c==100,"sum!=100"); taxSplit=TaxSplit(l,b,r,c); }

    // ===== OVERRIDES =====
    function _afterTokenTransfer(address f,address t,uint256 a) internal override(ERC
