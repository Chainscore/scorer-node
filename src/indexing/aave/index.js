const axios = require("axios");
require("dotenv").config();

exports.queryAaveSubgraph = (account) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        process.env.AAVE_V2_HOSTED,
        {
          query: `query users($id: ID!){
            users(where: {id: $id}){
              depositHistory{
                onBehalfOf{
                  id
                }
                amount
                reserve{
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
        reject(err.response.data.errors);
      });
  });
};

this.queryAaveSubgraph("0x64f80d81f4ae9858a9e92dce8d19ee1686cc8e04")
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });
