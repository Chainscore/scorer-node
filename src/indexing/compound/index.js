const axios = require("axios");
require("dotenv").config();

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

// this.queryCompSubgraph("0x8ACeaB8167c80CB8b3DE7fa6228b889bB1130Ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });