const {
  getAaveBalances,
  totalAaveRepaid,
  totalAaveDebt,

  getAaveSupplyPosition,
  getAaveBorrowPosition,
} = require("../indexing/aave");

const {
  totalCompDebt,
  totalCompRepaid,
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

      resolve({
        total_supplied: comp.total_supplied + aave.total_supplied,
        positions: comp.positions.concat(aave.positions),
      });
    }

    catch (err) {
      reject(err);
    }
  });
};

exports.getTotalBorrowHistory = (address) => {
  return new Promise(async (resolve, reject) => {
    let comp, aave;

    try {
      comp = await totalCompDebt(address);
      aave = await totalAaveDebt(address);
    

    resolve({
      total_borrowed: comp.total_borrowed + aave.total_borrowed,
      positions: comp.positions.concat(aave.positions),
    });
  } catch (err) {
    reject(err);
  }
  });
}

exports.getTotalRepaymentHistory = (address) => {
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
}

// this.getTotalRepaymentHistory("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });