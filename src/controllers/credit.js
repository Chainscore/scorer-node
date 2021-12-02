const {
  getAaveBalances,
  getAaveSupplyPosition,
  getAaveBorrowPosition,
} = require("../indexing/aave");

const {
  getCompBalances,
  getCompSupplyPosition,
  getCompBorrowPosition,
} = require("../indexing/compound");

exports.getBorrowPosition = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      aave = await getAaveBorrowPosition(address);
      comp = await getCompBorrowPosition(address);
    } catch (err) {
      reject(err);
    }

    resolve({
      total_borrowed: comp.total_borrowed + aave.total_borrowed,
      positions: comp.positions.concat(aave.positions),
    });
  });
};

exports.getSupplyPosition = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      comp = await getCompSupplyPosition(address);
      aave = await getAaveSupplyPosition(address);
    } catch (err) {
      reject(err);
    }

    resolve({
      total_supplied: comp.total_supplied + aave.total_supplied,
      positions: comp.positions.concat(aave.positions),
    });
  });
};
