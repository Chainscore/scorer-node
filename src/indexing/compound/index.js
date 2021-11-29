const axios = require("axios");
require("dotenv").config();

// {
//   accounts: [],
//   repayEvents: [],
//   borrowEvents: [],
//   liquidationEvents: [],
//   redeemEvents: [],
//   mintEvents: []
// }
exports.queryCompSubgraph = (account) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.COMP_V2_HOSTED,
        {
          query: `query accounts($id: ID!, $address: Bytes!){
              accounts(where: {id: $id}){
                tokens{
                  symbol
                  cTokenBalance
                  market{
                    underlyingPriceUSD
                  }
                  totalUnderlyingBorrowed
                  totalUnderlyingRepaid
                  totalUnderlyingSupplied
                  totalUnderlyingRedeemed
                  lifetimeBorrowInterestAccrued
                }
                health
                countLiquidated
                countLiquidator
                hasBorrowed
                totalBorrowValueInEth
                totalCollateralValueInEth
              }
              repayEvents(where: {borrower: $address}){
                amount
                accountBorrows
                blockTime
                underlyingSymbol
              }
              borrowEvents(where: {borrower: $address}){
                amount
                accountBorrows
                blockTime
                underlyingSymbol
              }
            
              liquidationEvents(where: {from: $address}){
                amount
                blockTime
                underlyingSymbol
                underlyingRepayAmount
              }
            
              redeemEvents(where: {from: $address}){
                amount
                blockTime
                cTokenSymbol
                underlyingAmount
              }
            
              mintEvents(where: {from: $address}){
                amount
                blockTime
                cTokenSymbol
                underlyingAmount
              }
          }`,
          variables: {
            id: account,
            address: account,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        resolve(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.errors);
      });
  });
};


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
        resolve(resp.data.data.compound);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

this.queryCompSubgraph("0xc98F11DAAAC76D3ef368fDF54fbbA34FfD951976")
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });