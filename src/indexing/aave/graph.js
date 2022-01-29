require("dotenv").config();
const { querySubgraph } = require("../../clients/graph");

const { readFileSync } = require("fs");
const query = readFileSync(
  process.cwd() + "/src/indexing/aave/query.gql"
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

function toUSD(amount, reserve) {
  return (
    (parseInt(amount) / 10 ** reserve.decimals) *
    (reserve.price.priceInEth / reserve.price.oracle.usdPriceEth)
  );
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
exports.totalDebt = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        resolve(calculateDebt(resp.users[0].reserves));
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
      current_borrowed += toUSD(
        reserves[i].currentTotalDebt,
        reserves[i].reserve
      );

      for (let j in reserves[i].borrowHistory) {
        total_borrowed += toUSD(
          reserves[i].borrowHistory[j].amount,
          reserves[i].reserve
        );
      }

      positions.push(reserves[i]);
    }
  }

  return { total_borrowed, current_borrowed, positions };
}

// ==================== REPAID ==================== //

/**
 * Get total repaid amount
 * @param {*} address
 * @returns uint repaid amount
 */
exports.totalRepaid = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        resolve(calculateRepaid(resp.users[0].reserves));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateRepaid(reserves) {
  let total_repaid = 0,
    positions = [];

  for (let i in reserves) {
    for (let j in reserves[i].repayHistory) {
      total_repaid += toUSD(
        reserves[i].repayHistory[j].amount,
        reserves[i].reserve
      );
    }

    positions.push(...reserves[i].repayHistory);
  }

  return { total_repaid, positions };
}

// ==================== SUPPLIED ==================== //

/**
 * Get total deposit supplied
 * @param {*} address
 * @returns uint total deposit
 */
exports.totalSupplied = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        resolve(calculateSupplied(resp.users[0].reserves));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateSupplied(reserves) {
  let total_supplied = 0,
    current_supplied = 0,
    positions = [];

  for (let i in reserves) {
    if (reserves[i].depositHistory.length > 0) {
      current_supplied += toUSD(
        reserves[i].currentATokenBalance,
        reserves[i].reserve
      );

      for (let j in reserves[i].depositHistory) {
        total_supplied += toUSD(
          reserves[i].depositHistory[j].amount,
          reserves[i].reserve
        );
      }

      positions.push(reserves[i]);
    }
  }

  return { total_supplied, current_supplied, positions };
}

// ==================== REDEEMED ==================== //

/**
 * Get total deposit supplied
 * @param {*} address
 * @returns uint total deposit
 */
exports.totalRedeemed = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then((resp) => {
        resolve(calculateRedeemed(resp.users[0].reserves));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateRedeemed(reserves) {
  let total_redeemed = 0,
    positions = [];

  for (let i in reserves) {
    for (let j in reserves[i].redeemUnderlyingHistory) {
      total_redeemed += toUSD(
        reserves[i].redeemUnderlyingHistory[j].amount,
        reserves[i].reserve
      );
    }
    positions.push(...reserves[i].redeemUnderlyingHistory);
  }

  return { total_redeemed, positions };
}

// ==================== USER POSITION ==================== //

exports.getUserPosition = (address) => {
  return new Promise((resolve, reject) => {
    queryAaveSubgraph(address)
      .then(async (resp) => {
        let positions = [],
          total_borrowed = 0,
          current_borrowed = 0,
          total_repaid = 0,
          total_supplied = 0,
          current_supplied = 0,
          total_redeemed = 0;

        if (resp.users.length > 0) {
          let repaid = calculateRepaid(resp.users[0].reserves);
          let borrowed = calculateDebt(resp.users[0].reserves);
          let supplied = calculateSupplied(resp.users[0].reserves);
          let redeemed = calculateRedeemed(resp.users[0].reserves);

          total_borrowed = borrowed.total_borrowed;
          current_borrowed = borrowed.current_borrowed;
          total_repaid = repaid.total_repaid;

          total_supplied = supplied.total_supplied;
          current_supplied = supplied.current_supplied;

          total_redeemed = redeemed.total_redeemed;
          positions = resp.users[0].reserves;
        }

        resolve({
          total_borrowed,
          current_borrowed,
          total_repaid,

          total_supplied,
          current_supplied,

          total_redeemed,
          positions,
        });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

/**
 * Gets data about each debt taken
 * TODO: Implementation
 * @param {*} address
 * @returns
 */
// exports.getDebtHistory = (address) => {
//   return new Promise((resolve, reject) => {
//     queryAaveSubgraph(address)
//       .then((resp) => {
//         // TODO ...
//       })
//       .catch((err) => {
//         console.log(err);
//         reject(err.response.data);
//       });
//   });
// };

// this.getUserPosition("0x933F12622c761B1bF5a4Ca444000F1d9C5D09e49")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
