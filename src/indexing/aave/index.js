const {
  totalDebt,
  totalRedeemed,
  totalSupplied,
  totalRepaid,
  getUserPosition
} = require("./graph");

const {
  getAaveBalances,
  getAaveSupplyPosition,
  getAaveBorrowPosition,
} = require("./covalent");


module.exports = {
  totalDebt,
  totalRedeemed,
  totalSupplied,
  totalRepaid,
  getUserPosition,
  
  getAaveBalances,
  getAaveSupplyPosition,
  getAaveBorrowPosition,
};
