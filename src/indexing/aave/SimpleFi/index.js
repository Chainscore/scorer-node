const { querySimpliFiAaveSubgraph } = require("./query");

const { getPrice } = require("../../prices-endpoint");

/**
 * Get total repaid amount
 * @param {*} address
 * @returns uint repaid amount
 */
exports.totalSimpleFiAaveRepaid = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {
        let total_repaid = 0;
        let positions = [];
        if (resp) {
          if (resp.repays) {
            let token;
            for (let i = 0; i < resp.repays.length; i++) {
              positions.push(resp.repays[i]);
              token = await getPrice(resp.repays[i].reserve);
              total_repaid += (resp.repays[i].amount / token.contract_decimals) * token.prices[0].price;
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
 * Get total debt
 * @param {*} address
 * @returns uint debt amount
 */
exports.totalSimpleFiAaveDebt = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {
        let total_borrowed = 0;
        let positions = [];
        if (resp) {
          if (resp.borrows) {
            let token;
            for (let i = 0; i < resp.borrows.length; i++) {
              positions.push(resp.borrows[i]);
              token = await getPrice(resp.borrows[i].reserve);
              total_borrowed += (resp.borrows[i].amount / token.contract_decimals) * token.prices[0].price;
            }
          }
        }
        resolve({ total_borrowed, positions });
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
exports.totalSimpleFiAaveDeposits = (address) => {
  return new Promise((resolve, reject) => {
    querySimpliFiAaveSubgraph(address)
      .then(async (resp) => {

        let total_deposits = 0;
        let positions = [];

        if (resp) {
          if (resp.deposits) {
            let token;
            let tasks = 0;
            for (let i = 0; i < resp.deposits.length; i++) {
              positions.push(resp.deposits[i]);
              token = await getPrice(resp.deposits[i].reserve);
              total_deposits += (resp.deposits[i].amount / 10**token.contract_decimals) * token.prices[0].price;
              console.log(total_deposits);
            }
          }
        }
        resolve({ total_deposits, positions });
      })
      .catch((err) => {
        console.log(err);
        reject(err.response.data);
      });
  });
};

this.totalSimpleFiAaveDeposits("0x21b9c3cc0a80ef376b27bdff23b252367404ae56")
  .then(resp => {
    console.log(resp);
  })