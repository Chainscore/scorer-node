const axios = require("axios");
require("dotenv").config();

exports.queryYearnSubgraph = (account) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.YEARN_V2_HOSTED,
        {
          query: `query accounts($id: ID!){
        accounts(where: {id: $id}){
          deposits{
            timestamp
            tokenAmount
            sharesMinted
          }
          withdrawals{
            timestamp
            tokenAmount
          }
          vaultPositions{
            vault{
              id
              token{
                id
                symbol
              }
              shareToken{
                id
                symbol
              }
              tags
            }
            balanceShares
            balanceTokens
            balancePosition
            balanceProfit
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
        resolve(resp.data.data.accounts[0]);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

// this.queryYearnSubgraph("0x64f80d81f4ae9858a9e92dce8d19ee1686cc8e04")
// .then(resp => {
//   console.log(resp);
// })