var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const { BigNumber } = require("ethers");


const Web3 = require('web3');

// const web3 = new Web3('wss://ropsten.infura.io/ws/v3/d65c95e0410745d585fe4630fb706c5f');
const web3 = new Web3('ws://localhost:7545');
// const web3 = new Web3('wss://ws.s0.b.hmny.io');

const scoreProtocolArtifacts = require('../score-contracts/build/contracts/ScoreProtocol.json');
const scoreProtocolContract = new web3.eth.Contract(scoreProtocolArtifacts.abi, scoreProtocolArtifacts.networks['5777'].address);

const stakingArtifacts = require('../score-contracts/build/contracts/sScoreToken.json');
const stakingContract = new web3.eth.Contract(stakingArtifacts.abi, stakingArtifacts.networks['5777'].address);

const scoreTokenArtifacts = require('../score-contracts/build/contracts/ScoreToken.json');
const scoreTokenContract = new web3.eth.Contract(scoreTokenArtifacts.abi, scoreTokenArtifacts.networks['5777'].address);

let tx;

let options = {
  filter: {
    value: [],
  },
  // fromBlock: 0
};

scoreProtocolContract.events.ScoreRequest(options)
  .on('data', async (event) => 
  {
    await processEvent(event)
  })
  .on('changed', changed => console.log(changed))
  .on('error', err => console.log(err))
  .on('connected', str => console.log(str))

async function processEvent(event) {
  console.log(`New Scoring Request`)
  console.log(`User: ${event.returnValues._user}, Contract: ${event.returnValues._contract}`)

  let is_Staking = await isStaking();

  if (is_Staking > 0) {
    const amount = is_Staking.toString()
    console.log(amount);


    tx = scoreTokenContract.methods.approve(stakingContract.options.address, amount);
    await sendTransaction(tx, scoreTokenContract);

    tx = stakingContract.methods.stake(amount);
    await sendTransaction(tx, stakingContract);
  }

  let staked = await stakingContract.methods.balanceOf(publicKey).call();
  console.log(staked);

  await evaluateScore(event.returnValues._user, event.returnValues._contract)
}

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;


async function evaluateScore(user, address) {

  const score = await calculateScore(user);

  tx = scoreProtocolContract.methods.fulfillScore(
    user,
    address,
    score
  );

  await sendTransaction(tx, scoreProtocolContract);
}

async function calculateScore(user) {
  // custom login
  return 1
}

async function isStaking() {
  let stake_req = await scoreProtocolContract.methods.stakeRequired().call();
  stake_req = BigNumber.from(stake_req);

  let staked = await stakingContract.methods.balanceOf(publicKey).call();
  staked = BigNumber.from(staked);

  console.log(stake_req.toString(), staked.toString())

  return stake_req.sub(staked)
}

async function sendTransaction(tx, contract) {

  const gas = await tx.estimateGas({ from: publicKey });
  const gasPrice = await web3.eth.getGasPrice();
  const data = tx.encodeABI();
  const nonce = await web3.eth.getTransactionCount(publicKey);
  const txData = {
    from: publicKey,
    to: contract.options.address,
    data: data,
    gas,
    gasPrice,
    nonce,
  };

  const createTransaction = await web3.eth.accounts.signTransaction(
    txData,
    privateKey
  );

  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction
  );
  console.log(
    `Transaction successful with hash: ${createReceipt.transactionHash}`
  );
}
module.exports = app;