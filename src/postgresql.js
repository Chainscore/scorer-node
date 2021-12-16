var pgp = require("pg-promise")(/* options */);
const fs = require("fs");

require("dotenv").config();

const connectionConf = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "tokens",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PWD,
  ssl: {
    sslmode: "verify-full",
    ca: fs.readFileSync(process.cwd() + "/src/.key.pem").toString(),
  },
};

var db = pgp(connectionConf);

exports.createTokenEntry = (address, price, decimals, ticker, token_name) => {
  return new Promise((resolve, reject) => {
    db.none(
      "INSERT INTO token_prices(address, price, decimals, ticker, token_name) VALUES(${address}, ${price}, ${decimals}, ${ticker}, ${token_name})",
      {
        address,
        price,
        decimals,
        ticker, 
        token_name
      }
    )
      .then(function (data) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

exports.deleteToken = (address) => {
  return new Promise((resolve, reject) => {
    db.none("delete from token_prices where address=${address}", {
      address,
    })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

exports.getAllTokens = () => {
  return new Promise((resolve, reject) => {
    db.any(`select * from token_prices`)
      .then(function (data) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

exports.getToken = (address) => {
  return new Promise((resolve, reject) => {
    db.any("select * from token_prices where address=${address}", {
      address,
    })
      .then(function (data) {
        resolve(data[0]);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

exports.updateToken = (address, price) => {
  return new Promise((resolve, reject) => {
    db.none("update token_prices set price=${price} where address=${address}", {
      address,
      price,
    })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};