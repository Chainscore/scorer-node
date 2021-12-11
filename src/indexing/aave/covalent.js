const axios = require("axios");
const { errors } = require("ethers");
require("dotenv").config();


exports.getAaveBalances = (address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.covalenthq.com/v1/1/address/${address}/stacks/aave_v2/balances/`,
        {
          params: {
            format: "JSON",
            "quote-currency": "USD",
            key: process.env.COVALENT_API_KEY_1,
          },
        },
        {
          timeout: 20000 // 10sec timeout
        }
      )
      .then((resp) => {
        resolve(resp.data.data.aave.balances);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};


exports.getAaveSupplyPosition = (address) => {
  return new Promise((resolve, reject) => {
    this.getAaveBalances(address)
      .then((balances) => {
        let total_supplied = 0;
        let positions = [];
        for(let i in balances){
          total_supplied += balances[i].supply_position.balance_quote;
          positions.push(balances[i].supply_position)
        }
        resolve({total_supplied, positions});
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};


exports.getAaveBorrowPosition = (address) => {
  return new Promise((resolve, reject) => {
    this.getAaveBalances(address)
      .then((balances) => {
        let total_borrowed = 0;
        let positions = [];
        for(let i in balances){
          total_borrowed += balances[i].borrow_position.balance_quote;
          positions.push(balances[i].borrow_position)
        }
        resolve({total_borrowed, positions});
      })
      .catch((err) => {
        console.log(err);
        reject(errors);
      });
  });
};