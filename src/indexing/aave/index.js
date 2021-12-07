const {
  queryAaveSubgraph,
  totalAaveRepaid,
  totalAaveDebt,
  totalAaveDeposits,
} = require("./graph");
const {
  getAaveBalances,
  getAaveSupplyPosition,
  getAaveBorrowPosition,
} = require("./covalent");

// getAaveBalances("0x21b9c3cc0a80ef376b27bdff23b252367404ae56")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = {
  queryAaveSubgraph,
  totalAaveRepaid,
  totalAaveDebt,
  totalAaveDeposits,

  getAaveBalances,
  getAaveSupplyPosition,
  getAaveBorrowPosition,
};
