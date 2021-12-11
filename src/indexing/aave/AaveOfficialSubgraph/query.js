const axios = require("axios");
require("dotenv").config();

// ! DOWN 
// ! Subgraph - https://thegraph.com/hosted-service/subgraph/aave/protocol-v2 
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
          if (resp.data.data) resolve(resp.data.data.users[0]);
          else resolve({});
        })
        .catch((err) => {
          console.log(err);
          reject(err.response);
        });
    });
  };