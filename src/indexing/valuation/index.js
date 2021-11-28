const axios = require("axios");
require("dotenv").config();

exports.getBalances = (address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.covalenthq.com/v1/1/address/${address}/balances_v2/`, {
        params: {
          format: "JSON",
          "quote-currency": "USD",
          key: process.env.COVALENT_API_KEY,
          nft: true,
          "no-nft-fetch": false,
        },
      })
      .then((resp) => {
        resolve(resp.data.data.items);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

exports.getTotalValuation = (address) => {
  this.getBalances(address)
    .then((tokens) => {
        let total = 0;
        for (let i = 0; i < tokens.length; i++) {
            total += (parseInt(tokens[i].balance) / 10 ** 18) * (tokens[i].quote_rate);
        }
        resolve(total);
    })
    .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message)
    });
};

this.getTotalValuation("0xc98F11DAAAC76D3ef368fDF54fbbA34FfD951976");
