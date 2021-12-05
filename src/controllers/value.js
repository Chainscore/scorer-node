const {
  getFTValuation,
  getTotalValuation,
  getFTBalances,
  getAllBalances,
} = require("../indexing/valuation");

exports.ftBalances = (address) => {
  return new Promise(async (resolve, reject) => {
      getFTValuation(address).then((total) => {
        resolve({ ...total });
      })
      .catch( err  => {
        reject(err)
      })
  });
};

exports.total_balances = (address) => {
  return new Promise(async (resolve, reject) => {
      getTotalValuation(address).then((total) => {
        resolve({ ...total });
      })
      .catch( err  => {
        reject(err)
      })
  });
};