const axios = require("axios");
require("dotenv").config();

exports.querySimpliFiAaveSubgraph = (account) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          process.env.SIMPLEFI_AAVE,
          {
            query: `query accounts($id: ID!, $user: String!){
                accounts(where: {id: $id}){
                  id
                  positions{
                    market{
                      outputToken{
                        id
                      }
                    }
                    positionType
                    inputTokenBalances
                    outputTokenBalance
                    rewardTokenBalances
                    closed
                  }
                }
                userAccountDatas(where: {id: $id}){
                  totalDebtETH
                  totalCollateralEth
                  currentLiquidationThreshold
                  availableBorrowsETH
                  healthFactor
                }
                userInvestmentBalances(where: {user: $id}){
                  aTokenBalance
                  scaledATokenBalance
                  reserve{
                    asset
                    assetDecimals
                    aToken
                  }
                }
                userDebtBalances(where: {user: $id}){
                  reserve{
                    asset
                    assetDecimals
                    aToken
                  }
                  amountBorrowedBalance
                  scaledDebtTokenBalance
                  rateMode
                }
                userRewardBalances(where: {id: $id}){
                  unclaimedRewards
                  claimedRewards
                  lifetimeRewards
                }
                borrows(where: {onBehalfOf: $user}){
                  reserve
                  amount
                  borrowRateMode
                }
                deposits(where:{onBehalfOf: $user}){
                  reserve
                  amount
                }
                repays(where:{repayer: $user}){
                  reserve
                  amount
                  rateMode
                }
                withdrawals(where: {user: $user}){
                  reserve
                  amount
                }
                swapRateModes(where: {user: $user}){
                  reserve
                  rateMode
                }
            }
          `,
            variables: {
              id: account,
              user: account
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((resp) => {
          if (resp.data.data) resolve(resp.data.data);
          else resolve({});
        })
        .catch((err) => {
          console.log(err);
          reject(err.response);
        });
    });
  };
  
// this.querySimpliFiAaveSubgraph("0x21b9c3cc0a80ef376b27bdff23b252367404ae56")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });