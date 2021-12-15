require("dotenv").config();
const { querySubgraph } = require("../../../clients/graph");

const { readFileSync } = require("fs");
const query = readFileSync(
  "/home/prasad/Desktop/chainscore/scorer-node/src/indexing/aave/SimpleFi/query.graphql"
).toString("utf-8");

// const { getPrice } = require("../../prices-endpoint");
const { getOrAddToken } = require("../../../controllers/tokens");

function querySimpliFiAaveSubgraph(account) {
  return new Promise((resolve, reject) => {
    account = account.toLowerCase();
    querySubgraph(process.env.SIMPLEFI_AAVE, query, {
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

/**
 * Get total repaid amount
 * @param {*} address
 * @returns uint repaid amount
 */
exports.totalSimpleFiAaveRepaid = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {
        resolve(await calculateRepaid(resp));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

async function calculateRepaid(resp) {
  let total_repaid = 0;
  let positions = [];
  if (resp) {
    if (resp.repays) {
      let token;
      for (let i = 0; i < resp.repays.length; i++) {
        positions.push(resp.repays[i]);
        token = await getOrAddToken(resp.repays[i].reserve);
        total_repaid += toUSD(resp.repays[i].amount, token);
      }
    }
  }
  return { total_repaid, positions };
}

/**
 * Get total debt
 * @param {*} address
 * @returns uint debt amount
 */
exports.totalSimpleFiAaveDebt = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {
        resolve(await calculateDebt(resp));
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

async function calculateDebt(resp) {
  let total_borrowed = 0;
  let positions = [];
  if (resp) {
    if (resp.borrows) {
      let token;
      for (let i = 0; i < resp.borrows.length; i++) {
        positions.push(resp.borrows[i]);
        token = await getOrAddToken(resp.borrows[i].reserve);
        total_borrowed += toUSD(resp.borrows[i].amount, token);
      }
    }
  }
  return { total_borrowed, positions };
}

/**
 * Get total deposit supplied
 * @param {*} address
 * @returns uint total deposit
 */
exports.totalSimpleFiAaveDeposits = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {
        resolve(await calculateDeposits(resp));
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

async function calculateDeposits(resp) {
  let total_deposits = 0;
  let positions = [];

  if (resp) {
    if (resp.deposits) {
      let token;
      for (let i = 0; i < resp.deposits.length; i++) {
        positions.push(resp.deposits[i]);
        token = await getOrAddToken(resp.deposits[i].reserve);
        total_deposits += toUSD(resp.deposits[i].amount, token);
      }
    }
  }
  return { total_deposits, positions };
}

exports.getUserPosition = (address) => {
  return new Promise(async (resolve, reject) => {
    querySimpliFiAaveSubgraph(address).then(async (resp) => {
      let positions = resp.accounts[0].positions;
      let total_rewards = 0;
      let deposit_position = 0;
      let borrow_position = 0;
      let input, input_balance = 0, output, reward;
      let token;
      for (let i in positions) {
        if (positions[i].rewardTokenBalances[0]) {
          reward = positions[i].rewardTokenBalances[0].split("|");
          
          if (parseInt(reward[2]) > 0) {
            token = await getOrAddToken(reward[0]);
            total_rewards += toUSD(reward[2], token);
          }
        }
        if (positions[i].inputTokenBalances[0]) {
          input = positions[i].inputTokenBalances[0].split("|");
          console.log(input)

          if (parseInt(input[2]) > 0) {
            token = await getOrAddToken(input[0]);
            input_balance += toUSD(input[2], token);
          }
        }
      }
      console.log(total_rewards, input_balance);

      let deposits = await calculateDeposits(resp);
      let repaid = await calculateRepaid(resp);
      let borrowed = await calculateDebt(resp);

      resolve({
        account: resp.accounts[0].id,

        total_supplied: deposits.total_deposits,
        deposit_history: deposits.positions,
        deposit_position,

        total_repaid: repaid.total_repaid,
        repaid_history: repaid.positions,

        total_borrowed: borrowed.total_borrowed,
        borrow_history: borrowed.positions,
        borrow_position,
      });
    });
  });
};

function toUSD(amount, token) {
  return (amount / 10**token.decimals) * token.price;
}

this.getUserPosition("0x94b685916905266474da31c195c9498e85f4df66").then(
  (resp) => {
    // console.log(resp);
    return;
  }
);
