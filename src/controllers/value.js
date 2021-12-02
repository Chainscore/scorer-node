const {
  getFTValuation,
  getTotalValuation,
  getFTBalances,
  getAllBalances,
} = require("../indexing/valuation");

exports.ftBalances = (address) => {
  return new Promise(async (resolve, reject) => {
    getFTBalances(address).then((result) => {
      getFTValuation(address).then((total) => {
        resolve({ total: total.total, ...result });
      });
    });
  });
};

exports.total_balances = (address) => {
  return new Promise(async (resolve, reject) => {
    getAllBalances(address).then((result) => {
      getTotalValuation(address).then((total) => {
        resolve({ total: total.total, ...result });
      });
    });
  });
};