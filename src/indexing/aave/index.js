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
                  price{
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
                  price{
                    priceInEth
                  }
                }
                timestamp
              }
              usageAsCollateralHistory{
                reserve{
                  id
                  underlyingAsset
                  price{
                    priceInEth
                  }
                }
                timestamp
              }
              rebalanceStableBorrowRateHistory{
                reserve{
                  id
                  underlyingAsset
                  price{
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
                  price{
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
                  price{
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
            id: account
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

exports.getAaveBalances = (address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
      `https://api.covalenthq.com/v1/1/address/${address}/stacks/aave/balances/`, {
        params: {
          "format": "JSON",
          "quote-currency": "USD",
          "key": process.env.COVALENT_API_KEY,
        },
      })
      .then((resp) => {
        resolve(resp.data.data.aave);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};


this.getAaveBalances("0x21b9c3cc0a80ef376b27bdff23b252367404ae56")
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });
