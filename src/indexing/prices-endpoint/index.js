const axios = require("axios");
const { errorExchange } = require("urql");
require("dotenv").config();

exports.getPrice = (token_address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token_address}/`,
        {
          params: {
            format: "JSON",
            "quote-currency": "USD",
            key: process.env.COVALENT_API_KEY_3,
            nft: true,
          },
        }
      )
      .then((resp) => {
        resolve(resp.data.data[0]);
      })
      .catch((err) => {
        console.log("Error: ", err);
        reject(err);
      });
  });
};

exports.getHistoricalPrice = (token_address, start, end) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/${token_address}/`,
        {
          params: {
            "prices-at-asc": true,
            from: start,
            to: end,
            format: "JSON",
            "quote-currency": "USD",
            key: process.env.COVALENT_API_KEY_3,
            nft: true,
          },
        }
      )
      .then((resp) => {
        resolve(resp.data.data[0]);
      })
      .catch((err) => {
        console.log("Error: ", err);
        reject(err);
      });
  });
};

exports.getSpotPrice = (ticker) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.covalenthq.com/v1/pricing/tickers/`, {
        params: {
          "quote-currency": "USD",
          format: "JSON",
          tickers: ticker,
          key: process.env.COVALENT_API_KEY_3,
        },
      })
      .then((resp) => {
        resolve(resp.data.data);
      })
      .catch((err) => {
        console.log("Error: ", err);
        reject(errorExchange);
      });
  });
};

// this.getPrice('0xee06a81a695750e71a662b51066f2c74cf4478a0')
// .then(resp => {
//   console.log(resp.prices[0].price);
// })

// this.getHistoricalPrice('0xee06a81a695750e71a662b51066f2c74cf4478a0', "2021-01-10", "2021-01-20")

// this.getSpotPrice("ETH").then((resp) => {
//   console.log(resp.items[0].quote_rate);
// });
