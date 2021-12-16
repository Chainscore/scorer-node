require("dotenv").config();
const { querySubgraph } = require("../../clients/graph");

const { readFileSync } = require("fs");
const query = readFileSync(
  process.cwd() + "/src/indexing/compound/query.gql"
).toString("utf-8");

const { getSpotPrice } = require("../prices-endpoint");

// {
//   accounts: [],
//   repayEvents: [],
//   borrowEvents: [],
//   liquidationEvents: [],
//   redeemEvents: [],
//   mintEvents: []
// }
exports.queryCompSubgraph = (account) => {
  return new Promise((resolve, reject) => {
    account = account.toLowerCase();
    querySubgraph(process.env.COMP_V2_HOSTED, query, {
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
};

// ==================== DEBT ==================== //

/**
 * Get total debt
 * @param {*} address
 * @returns uint debt amount
 */
exports.totalDebt = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        resolve(calculateDebt(resp.accounts[0].tokens));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateDebt(tokens) {
  let total_borrowed = 0,
    current_borrowed = 0,
    positions = [];

  for (let i in tokens) {
    if (tokens[i].totalUnderlyingBorrowed > 0) {
      total_borrowed += parseInt(
        tokens[i].totalUnderlyingBorrowed * tokens[i].market.underlyingPriceUSD
      );
      current_borrowed += parseInt(
        tokens[i].borrowBalanceUnderlying * tokens[i].market.underlyingPriceUSD
      );
      positions.push(tokens[i]);
    }
  }

  return { total_borrowed, current_borrowed, positions };
}

// ==================== REPAID ==================== //

/**
 * Get total amount repaid
 * @param {*} address
 * @returns uint total repaid
 */
exports.totalRepaid = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        resolve(calculateRepaid(resp.accounts[0].tokens));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

function calculateRepaid(tokens) {
  let total_repaid = 0,
    positions = [];

  for (let i in tokens) {
    if (tokens[i].totalUnderlyingRepaid > 0) {
      total_repaid += parseInt(
        tokens[i].totalUnderlyingRepaid * tokens[i].market.underlyingPriceUSD
      );
      positions.push(tokens[i]);
    }
  }

  return { total_repaid, positions };
}

// ==================== SUPPLY ==================== //

/**
 * Get total tokens supplied (value in USD)
 * @param {*} address
 * @returns uint supplied amount
 */
exports.totalSupplied = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        resolve(calculateSupplied(resp.accounts[0].tokens));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateSupplied(tokens) {
  let total_supplied = 0,
    current_supplied = 0,
    positions = [];

  for (let i in tokens) {
    if (tokens[i].totalUnderlyingSupplied > 0) {
      total_supplied += parseInt(
        tokens[i].totalUnderlyingSupplied * tokens[i].market.underlyingPriceUSD
      );
      current_supplied += parseInt(
        tokens[i].supplyBalanceUnderlying * tokens[i].market.underlyingPriceUSD
      );
      positions.push(tokens[i]);
    }
  }

  return { total_supplied, current_supplied, positions };
}

// ==================== REDEEM ==================== //

/**
 * Get total amount redeemed (in USD)
 * @param {*} address
 * @returns uint redeemed amount
 */
exports.totalRedeemed = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        resolve(calculateRedeemed(resp.accounts[0].tokens));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

function calculateRedeemed(tokens) {
  let total_redeemed = 0,
    positions = [];

  for (let i in tokens) {
    if (tokens[i].totalUnderlyingRedeemed > 0) {
      total_redeemed += parseInt(
        tokens[i].totalUnderlyingRedeemed * tokens[i].market.underlyingPriceUSD
      );
      positions.push(tokens[i]);
    }
  }

  return { total_redeemed, positions };
}

// ==================== USER POSITION ==================== //

exports.getUserPosition = (address) => {
  return new Promise((resolve, reject) => {
    this.queryCompSubgraph(address)
      .then(async (resp) => {
        let positions = [],
          total_borrowed = 0,
          current_borrowed = 0,
          total_repaid = 0,
          total_supplied = 0,
          current_supplied = 0,
          total_redeemed = 0;

        if (resp.accounts.length > 0) {
          let repaid = calculateRepaid(resp.accounts[0].tokens);
          let borrowed = calculateDebt(resp.accounts[0].tokens);
          let supplied = calculateSupplied(resp.accounts[0].tokens);
          let redeemed = calculateRedeemed(resp.accounts[0].tokens);

          total_borrowed = borrowed.total_borrowed;
          current_borrowed = borrowed.current_borrowed;
          total_repaid = repaid.total_repaid;

          total_supplied = supplied.total_supplied;
          current_supplied = supplied.current_supplied;

          total_redeemed = redeemed.total_redeemed;
          positions = resp.accounts[0].tokens;
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

// this.getUserPosition("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err.data);
//   });
