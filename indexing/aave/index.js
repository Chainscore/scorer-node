require('dotenv').config();

const Web3 = require('web3');
const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`);

const lendingPoolArtifacts = require("./abis/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json");
const lendingPool = new web3.eth.Contract(lendingPoolArtifacts.abi, process.env.AAVE_LENDING_POOL_ADDRESS);


// /**
//    * @dev Emitted on repay()
//    * @param reserve The address of the underlying asset of the reserve
//    * @param user The beneficiary of the repayment, getting his debt reduced
//    * @param repayer The address of the user initiating the repay(), providing the funds
//    * @param amount The amount repaid
//    **/
//  event Repay(
//     address indexed reserve,
//     address indexed user,
//     address indexed repayer,
//     uint256 amount
//   );

function getBorrowEvents() {
    lendingPool.getPastEvents('Borrow', {
        filter: {user: "0x0a6077c72E2D68d820906BA577783De7654fca54"}, 
        fromBlock: 1349205,
        toBlock: 'latest'
    })
    .then(events => {
        console.log(events) // same results as the optional callback above
        console.log(events.length);
        return events
    })
    .catch(err => {
        console.log(err);
        getBorrowEvents();
    })
}

getBorrowEvents()

// /**
//    * @dev Emitted on borrow() and flashLoan() when debt needs to be opened
//    * @param reserve The address of the underlying asset being borrowed
//    * @param user The address of the user initiating the borrow(), receiving the funds on borrow() or just
//    * initiator of the transaction on flashLoan()
//    * @param onBehalfOf The address that will be getting the debt
//    * @param amount The amount borrowed out
//    * @param borrowRateMode The rate mode: 1 for Stable, 2 for Variable
//    * @param borrowRate The numeric rate at which the user has borrowed
//    * @param referral The referral code used
//    **/
//  event Borrow(
//     address indexed reserve,
//     address user,
//     address indexed onBehalfOf,
//     uint256 amount,
//     uint256 borrowRateMode,
//     uint256 borrowRate,
//     uint16 indexed referral
//   );