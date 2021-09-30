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

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

// const web3 = new Web3('wss://ropsten.infura.io/ws/v3/d65c95e0410745d585fe4630fb706c5f');
// const web3 = new Web3('ws://localhost:7545');
const web3 = new Web3('wss://ws.s0.b.hmny.io');

const scoreProtocolArtifacts = require('../contracts/build/contracts/ScoreProtocol.json');
const scoreProtocolContract = new web3.eth.Contract(scoreProtocolArtifacts.abi, scoreProtocolArtifacts.networks['1666700000'].address);

const stakingArtifacts = require('../contracts/build/contracts/sScoreToken.json');
const stakingContract = new web3.eth.Contract(stakingArtifacts.abi, stakingArtifacts.networks['1666700000'].address);

const scoreTokenArtifacts = require('../contracts/build/contracts/ScoreToken.json');
const scoreTokenContract = new web3.eth.Contract(scoreTokenArtifacts.abi, scoreTokenArtifacts.networks['1666700000'].address);

let tx;

let options = {
  filter: {
    value: [],
  },
  // fromBlock: 0
};

scoreProtocolContract.events.ScoreRequest(options)
  .on('data', async (event) => {
    await processEvent(event)
  })
  .on('changed', changed => console.log(changed))
  .on('error', err => console.log(err))
  .on('connected', str => console.log('Connected to Score Protocol', str))

async function processEvent(event) {
  console.log(`New Scoring Request`)
  console.log(`User: ${event.returnValues._user}, Contract: ${event.returnValues._contract}`)

  await evaluateScore(event.returnValues._user, event.returnValues._contract)
}


async function evaluateScore(user, address) {

  const score = await calculateScore(user);
  tx = scoreProtocolContract.methods.fulfillScore(
    user,
    address,
    score
  );

  console.log('Submitting Score...')

  await sendTransaction(tx, scoreProtocolContract);
}

async function calculateScore(user) {
  // custom login
  return 1
}

async function stake() {
  let stake_req = await scoreProtocolContract.methods.stakeRequired().call();
  stake_req = BigNumber.from(stake_req);

  let staked = await stakingContract.methods.balanceOf(publicKey).call();
  staked = BigNumber.from(staked);

  let is_Staking = stake_req.sub(staked);

  if (is_Staking > 0) {
    console.log("Staking SCORE tokens....")
    const amount = is_Staking.toString()

    tx = scoreTokenContract.methods.approve(stakingContract.options.address, amount);
    await sendTransaction(tx, scoreTokenContract);

    tx = stakingContract.methods.stake(amount);
    await sendTransaction(tx, stakingContract);
  }
  
  console.log("Node is staked");
  return 
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

stake();
module.exports = app;