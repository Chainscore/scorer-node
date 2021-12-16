const {
  totalDebt: totalAaveDebt,
  totalRedeemed: totalAaveRedeemed,
  totalSupplied: totalAaveSupplied,
  totalRepaid: totalAaveRepaid,
  getUserPosition: getAaveUserPosition,

  getAaveSupplyPosition,
  getAaveBorrowPosition,
} = require("../indexing/aave");

const {
  totalDebt: totalCompDebt,
  totalRedeemed: totalCompRedeemed,
  totalSupplied: totalCompSupplied,
  totalRepaid: totalCompRepaid,
  getUserPosition: getCompUserPosition,

  getCompSupplyPosition,
  getCompBorrowPosition,
} = require("../indexing/compound");

exports.getBorrowPosition = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      aave = await totalAaveDebt(address);
      comp = await totalCompDebt(address);
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
      comp = await totalCompSupplied(address);
      aave = await totalAaveSupplied(address);

      resolve({
        total_supplied: comp.total_supplied + aave.total_supplied,
        positions: comp.positions.concat(aave.positions),
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getRedeemHistory = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      comp = await totalCompRedeemed(address);
      aave = await totalAaveRedeemed(address);

      resolve({
        total_supplied: comp.total_redeemed + aave.total_redeemed,
        positions: comp.positions.concat(aave.positions),
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getRepaymentHistory = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      comp = await totalCompRepaid(address);
      aave = await totalAaveRepaid(address);

      resolve({
        total_repaid: comp.total_repaid + aave.total_repaid,
        positions: comp.positions.concat(aave.positions),
      });
    } catch (err) {
      reject(err);
    }
  });
};

exports.getAllPositions = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      comp = await getCompUserPosition(address);
      aave = await getAaveUserPosition(address);

      resolve({
        total_borrowed: comp.total_borrowed + aave.total_borrowed, 
        current_borrowed: comp.current_borrowed + aave.current_borrowed,
        total_repaid: comp.total_repaid + aave.total_repaid, 

        total_supplied: comp.total_supplied + aave.total_supplied,
        current_supplied: comp.current_supplied + comp.current_supplied,

        total_redeemed: comp.total_redeemed + aave.total_redeemed,
        positions: comp.positions.concat(aave.positions),
      });
    } catch (err) {
      reject(err);
    }
  });
};

// this.getAll("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });