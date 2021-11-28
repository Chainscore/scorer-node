require('dotenv').config();

const Web3 = require('web3');
const web3 = new Web3(`wss://mainnet.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`);

const lendingPoolArtifacts = require("./abis/contracts/protocol/lendingpool/LendingPool.sol/LendingPool.json");
const lendingPool = new web3.eth.Contract(lendingPoolArtifacts.abi, process.env.AAVE_LENDING_POOL_ADDRESS);

const axios = require("axios");

const data = await axios.post(API_URL, {
    query: `mutation updateUserCity($id: Int!, $city: String!) {
      updateUserCity(userID: $id, city: $city){
        id
        name
        age
        city
        knowledge{
          language
          frameworks
        }
      }
    }`,
    variables: {
      id: 2,
      city: 'Test'
    }
  }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })