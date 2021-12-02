const axios = require("axios");
require("dotenv").config();

// Subgraph - https://thegraph.com/hosted-service/subgraph/aave/protocol-v2
// {
//   borrowHistory: [],
//   depositHistory: [
//     {
//       amount: '255629248647495229293',
//       onBehalfOf: [Object],
//       reserve: [Object],
//       timestamp: 1624747873
//     }
//   ],
//   rebalanceStableBorrowRateHistory: [],
//   redeemUnderlyingHistory: [
//     {
//       amount: '429038367459142390185',
//       onBehalfOf: [Object],
//       reserve: [Object],
//       timestamp: 1638107504
//     }
//   ],
//   repayHistory: [],
//   usageAsCollateralHistory: [
//     { reserve: [Object], timestamp: 1624747873 }
//   ]
// }
exports.queryAaveSubgraph = (account) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.AAVE_V2_HOSTED,
        {
          query: `query users($id: ID!){
            users(where: {id: $id}){
              unclaimedRewards
              depositHistory{
                onBehalfOf{
                  id
                }
                amount
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                timestamp
              }
              redeemUnderlyingHistory{
                onBehalfOf{
                  id
                }
                amount
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                timestamp
              }
              usageAsCollateralHistory{
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                timestamp
              }
              rebalanceStableBorrowRateHistory{
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                timestamp
              }
              borrowHistory{
                onBehalfOf{
                  id
                }
                amount
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                borrowRate
                stableTokenDebt
                variableTokenDebt
                timestamp
              }
              repayHistory{
                onBehalfOf{
                  id
                }
                reserve{
                  id
                  underlyingAsset
                  symbol
                  price{
                    oracle{
                      usdPriceEth
                    }
                    lastUpdateTimestamp
                    priceInEth
                  }
                }
                amount
                timestamp
              }
            }
          }
        `,
          variables: {
            id: account,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((resp) => {
        resolve(resp.data.data.users[0]);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response);
      });
  });
};

/**
 * Get total repaid amount
 * @param {*} address 
 * @returns uint repaid amount
 */
exports.totalRepaid = (address) => {
  return new Promise((resolve, reject) => {
    this.queryAaveSubgraph(address)
      .then((resp) => {
        let debt = 0;
        for (let i = 0; i < resp.repayHistory.length; i++) {
          console.log(
            resp.repayHistory[i].amount / 10 ** 18,
            resp.repayHistory[i].reserve.symbol,
            resp.repayHistory[i].reserve.price.priceInEth /
              resp.repayHistory[i].reserve.price.oracle.usdPriceEth
          );
          debt +=
            ((resp.repayHistory[i].amount / 10 ** 18) *
              resp.repayHistory[i].reserve.price.priceInEth) /
            resp.repayHistory[i].reserve.price.oracle.usdPriceEth;
        }
        resolve(debt);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

/**
 * Get total debt
 * @param {*} address 
 * @returns uint debt amount
 */
exports.totalDebt = (address) => {
  return new Promise((resolve, reject) => {
    this.queryAaveSubgraph(address)
      .then((resp) => {
        let debt = 0;
        for (let i = 0; i < resp.borrowHistory.length; i++) {
          debt +=
            ((resp.borrowHistory[i].amount / 10 ** 18) *
              resp.borrowHistory[i].reserve.price.priceInEth) /
            resp.borrowHistory[i].reserve.price.oracle.usdPriceEth;
        }
        resolve(debt);
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
exports.totalDeposits = (address) => {
  return new Promise((resolve, reject) => {
    this.queryAaveSubgraph(address)
      .then((resp) => {
        let deposits = 0;
        for (let i = 0; i < resp.depositHistory.length; i++) {
          deposits +=
            ((resp.depositHistory[i].amount / 10 ** 18) *
              resp.depositHistory[i].reserve.price.priceInEth) /
            resp.depositHistory[i].reserve.price.oracle.usdPriceEth;
        }
        resolve(deposits);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};



/**
 * Gets data about each debt taken
 * TODO: Implementation
 * @param {*} address 
 * @returns 
 */
exports.getDebt = (address) => {
  return new Promise((resolve, reject) => {
    this.queryAaveSubgraph(address)
      .then((resp) => {
        let debt = 0;
        for (let i = 0; i < resp.borrowHistory.length; i++) {
          if(resp.borrowHistory[i].reserve.symbol == "BUSD"){
            console.log(
              resp.borrowHistory[i].amount / 10 ** 18,
              resp.borrowHistory[i].reserve.symbol,
              resp.borrowHistory[i].reserve.price.priceInEth /
                resp.borrowHistory[i].reserve.price.oracle.usdPriceEth
            );
            debt +=
            ((resp.borrowHistory[i].amount / 10 ** 18) *
              resp.borrowHistory[i].reserve.price.priceInEth) /
            resp.borrowHistory[i].reserve.price.oracle.usdPriceEth;
          }
          
        }
        console.log(debt);
        debt = 0;
        console.log("===Repay===");
        for (let i = 0; i < resp.repayHistory.length; i++) {
          if(resp.repayHistory[i].reserve.symbol == "BUSD"){
          console.log(
            resp.repayHistory[i].amount / 10 ** 18,
            resp.repayHistory[i].reserve.symbol,
            resp.repayHistory[i].reserve.price.priceInEth /
              resp.repayHistory[i].reserve.price.oracle.usdPriceEth
          );
          debt +=
            ((resp.repayHistory[i].amount / 10 ** 18) *
              resp.repayHistory[i].reserve.price.priceInEth) /
            resp.repayHistory[i].reserve.price.oracle.usdPriceEth;
          }
        }
        console.log(debt);
        // resolve(debt);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

/**
 * demo
 */
// this.totalDebt("0x21b9c3cc0a80ef376b27bdff23b252367404ae56")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
