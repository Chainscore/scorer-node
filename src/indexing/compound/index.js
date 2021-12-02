const { queryCompSubgraph } = require("./graph");
const {
  getCompBalances,
  getCompSupplyPosition,
  getCompBorrowPosition,
} = require("./covalent");

// this.queryCompSubgraph("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = {
  queryCompSubgraph,

  getCompBalances,
  getCompSupplyPosition,
  getCompBorrowPosition,
};