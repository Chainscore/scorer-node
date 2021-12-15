require("dotenv").config();
const { querySubgraph } = require("../../../clients/graph");

const { readFileSync } = require("fs");
const { parse } = require("graphql");
const query = readFileSync(
  process.cwd() + "/src/indexing/aave/AaveOfficialSubgraph/query.gql"
).toString("utf-8");

function queryAaveSubgraph(account) {
  return new Promise((resolve, reject) => {
    account = account.toLowerCase();
    querySubgraph(process.env.AAVE_V2_HOSTED, query, {
      id: account,
      user: account,
    })
      .then((resp) => {
        if (resp.data.data) resolve(resp.data.data);
        else resolve({});
      })
      .catch((err) => {
        console.log(err);
        reject(err.response);
      });
  });
}

function toETH(amount, reserve) {
  (parseInt(amount) / 10 ** reserve.decimals) * reserve.price.priceInEth;
}

/** RESERVE
 * borrowHistory
 * depositHistory
 * repayHistory
 */
// ==================== DEBT ==================== //

/**
 * Get total debt
 * @param {*} address
 * @returns uint debt amount
 */
exports.totalAaveDebt = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        resolve((calculateDebt(resp.users[0].reserves)));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateDebt(reserves) {
  let total_borrowed = 0,
    current_borrowed = 0,
    positions = [];

  for (let i in reserves) {
    if (reserves[i].borrowHistory.length > 0) {
      current_borrowed += toETH(
        reserves[i].currentTotalDebt,
        reserves[i].reserve
      );

      for (let j in reserves[i].borrowHistory) {
        total_borrowed += toETH(
          reserves[i].borrowHistory[j].amount,
          reserves[i].reserve
        );
      }

      positions.push(reserves[i].reserve)
    }
  }

  return({total_borrowed, current_borrowed, positions})
}


// ==================== REPAID ==================== //

/**
 * Get total repaid amount
 * @param {*} address
 * @returns uint repaid amount
 */
exports.totalAaveRepaid = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        let total_repaid = 0;
        let positions = [];
        if (resp) {
          if (resp.repayHistory) {
            for (let i = 0; i < resp.repayHistory.length; i++) {
              positions.push(resp.repayHistory[i]);
              total_repaid +=
                ((resp.repayHistory[i].amount / 10 ** 18) *
                  resp.repayHistory[i].reserve.price.priceInEth) /
                resp.repayHistory[i].reserve.price.oracle.usdPriceEth;
            }
          }
        }
        resolve({ total_repaid, positions });
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
exports.totalAaveDeposits = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        let deposits = 0;
        if (resp) {
          if (resp.depositHistory) {
            for (let i = 0; i < resp.depositHistory.length; i++) {
              deposits +=
                ((resp.depositHistory[i].amount / 10 ** 18) *
                  resp.depositHistory[i].reserve.price.priceInEth) /
                resp.depositHistory[i].reserve.price.oracle.usdPriceEth;
            }
          }
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
exports.getDebtHistory = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        let debt = 0;
        for (let i = 0; i < resp.borrowHistory.length; i++) {
          if (resp.borrowHistory[i].reserve.symbol == "BUSD") {
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
          if (resp.repayHistory[i].reserve.symbol == "BUSD") {
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

this.totalAaveDebt("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });
