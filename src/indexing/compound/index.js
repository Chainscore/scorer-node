const {
  totalDebt,
  totalRedeemed,
  totalSupplied,
  totalRepaid,
  getUserPosition
} = require("./graph");

const {
  getCompBalances,
  getCompSupplyPosition,
  getCompBorrowPosition,
} = require("./covalent");


module.exports = {
  totalDebt,
  totalRedeemed,
  totalSupplied,
  totalRepaid,
  getUserPosition,

  getCompBalances,
  getCompSupplyPosition,
  getCompBorrowPosition,
};
