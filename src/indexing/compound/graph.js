const axios = require("axios");
require("dotenv").config();

const { getSpotPrice } = require('../prices-endpoint');

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


/**
 * Get total debt
 * @param {*} address 
 * @returns uint debt amount
 */
 exports.totalCompDebt = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        let total_borrowed = 0;
        let assetPrice = 0;
        let positions = []
        if (resp.borrowEvents) {
        for (let i = 0; i < resp.borrowEvents.length; i++) {
          positions.push(resp.borrowEvents[i]);

          assetPrice = await getSpotPrice(resp.borrowEvents[i].underlyingSymbol);

          // console.log((resp.borrowEvents[i].amount), resp.borrowEvents[i].underlyingSymbol, (assetPrice).items[0].quote_rate);

          total_borrowed +=
            ((resp.borrowEvents[i].amount) * (assetPrice.items[0].quote_rate)/** Price of asset */);
        }
      }
        resolve({total_borrowed, positions});
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

/**
 * Get total deposit supplied
 * @param {*} address 
 * @returns uint total deposit
 */
exports.totalCompRepaid = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        let total_repaid = 0;
        let assetPrice = 0;

        let positions = [];
        if(resp.repayEvents){
        for (let i = 0; i < resp.repayEvents.length; i++) {
          positions.push(resp.repayEvents[i]);

          assetPrice = await getSpotPrice(resp.repayEvents[i].underlyingSymbol)
          
          // console.log((resp.repayEvents[i].amount), resp.repayEvents[i].underlyingSymbol, (assetPrice).items[0].quote_rate);

          total_repaid +=
            ((resp.repayEvents[i].amount) * (assetPrice).items[0].quote_rate)/** Price of asset */;

        }
      }
        resolve({total_repaid, positions});
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};


// this.queryCompSubgraph("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// this.totalCompDebt("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// this.totalCompRepaid("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });