const axios = require("axios");
require("dotenv").config();

// {
//   balances: [
//     {
//       account_address: '0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8',
//       source: '',
//       supply_tokens: [Array],
//       borrow_tokens: [Array],
//       total_supply_eth: '459851750000000000000000',
//       total_borrow_eth: '150339500000000000000000',
//       total_collateral_eth: '367553843750000000000000',
//       total_borrowing_power_eth: '194284671875000000000000',
//       total_supply_eth_quote: 1879039740,
//       total_borrow_eth_quote: 614315140,
//       total_collateral_eth_quote: 1501893250,
//       total_borrowing_power_eth_quote: 793883260,
//       comp_accrued_quote: 26002.043,
//       comp_balance_quote: 0,
//       comp_balance: '0',
//       comp_accrued: '93001297275972877379'
//     }
//   ]
// }
exports.getCompBalances = (address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
      `https://api.covalenthq.com/v1/1/address/${address}/stacks/compound/balances/`, {
        params: {
          "format": "JSON",
          "quote-currency": "USD",
          "key": process.env.COVALENT_API_KEY,
        },
      })
      .then((resp) => {
        resolve(resp.data.data.compound.balances);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

exports.getCompSupplyPosition = (address) => {
    return new Promise((resolve, reject) => {
        this.getCompBalances(address)
          .then((balances) => {
            let positions = [];
            let token;
            let total_supplied = 0;
            for(let i in balances){
                for(let j in balances[i].supply_tokens){
                    token = balances[i].supply_tokens[j];
                    positions.push({
                        supply_position: `${parseInt(token.balance)/(10**(token.contract_decimals))} ${token.contract_ticker_symbol} supplied`,
                        balance: parseInt(token.balance)/(10**(token.contract_decimals)),
                        balance_quote: token.balance_quote,
                        apr: token.apr
                    })
                }
                total_supplied += balances[i].total_supply_eth_quote;
            }
            resolve({total_supplied, positions});
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
}


exports.getCompBorrowPosition = (address) => {
    return new Promise((resolve, reject) => {
        this.getCompBalances(address)
          .then((balances) => {
            let positions = [];
            let token;
            let total_borrowed = 0;
            for(let i in balances){
                for(let j in balances[i].borrow_tokens){
                    token = balances[i].borrow_tokens[j];
                    positions.push({
                        supply_position: `${parseInt(token.balance)/(10**(token.contract_decimals))} ${token.contract_ticker_symbol} borrowed`,
                        balance: parseInt(token.balance)/(10**(token.contract_decimals)),
                        balance_quote: token.balance_quote,
                        apr: token.apr
                    })
                }
                total_borrowed += balances[i].total_borrow_eth_quote;
            }
            resolve({total_borrowed, positions});
          })
          .catch((err) => {
            console.log(err);
            reject(err.response.data);
          });
      });
}