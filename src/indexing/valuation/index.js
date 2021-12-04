const axios = require("axios");
require("dotenv").config();

exports.getFTBalances = (address) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.covalenthq.com/v1/1/address/${address}/balances_v2/`, {
        params: {
          format: "JSON",
          "quote-currency": "USD",
          key: process.env.COVALENT_API_KEY,
          nft: false,
          "no-nft-fetch": false,
        },
      })
      .then((resp) => {
        resolve(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

exports.getAllBalances = (address) => {
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
        resolve(resp.data.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message);
      });
  });
};

exports.getFTValuation = (address) => {
  return new Promise((resolve, reject) => {
  this.getFTBalances(address)
    .then((resp) => {

      let total = 0;

      for (let i = 0; i < resp.items.length; i++) {
        total += resp.items[i].balance.quote;
      }
      resolve({...resp, total});
    })
    .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message)
    });
  })
};


exports.getTotalValuation = (address) => {
  return new Promise((resolve, reject) => {
  this.getAllBalances(address)
    .then((resp) => {

      let total = 0;

      for (let i = 0; i < resp.items.length; i++) {
        total += resp.items[i].quote;
      }

      resolve({...resp, total});
    })
    .catch((err) => {
        console.log(err);
        reject(err.response.data.error_message)
    });
  })
};

// this.getTotalValuation("0xc98F11DAAAC76D3ef368fDF54fbbA34FfD951976");
// .then(resp => {
//   console.log(resp);
// })