const { queryAaveSubgraph } = require("./query");

/**
 * Get total repaid amount
 * @param {*} address
 * @returns uint repaid amount
 */
 exports.totalAaveRepaid = (address) => {
    return new Promise((resolve, reject) => {
      queryAaveSubgraph(address)
        .then((resp) => {
          let total_repaid = 0;
          let positions = [];
          if (resp) {
  
            if (resp.repayHistory) {
              for (let i = 0; i < resp.repayHistory.length; i++) {
                positions.push(resp.repayHistory[i]);
                total_repaid +=
                  ((resp.repayHistory[i].amount / 10 ** 18) *
                    resp.repayHistory[i].reserve.price.priceInEth) /
                  resp.repayHistory[i].reserve.price.oracle.usdPriceEth;
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
  exports.totalAaveDebt = (address) => {
    return new Promise((resolve, reject) => {
      queryAaveSubgraph(address)
        .then((resp) => {
          let total_borrowed = 0;
          let positions = [];
          if (resp) {
  
            if (resp.borrowHistory) {
              for (let i = 0; i < resp.borrowHistory.length; i++) {
                positions.push(resp.borrowHistory[i]);
                total_borrowed +=
                  ((resp.borrowHistory[i].amount / 10 ** 18) *
                    resp.borrowHistory[i].reserve.price.priceInEth) /
                  resp.borrowHistory[i].reserve.price.oracle.usdPriceEth;
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
  exports.totalAaveDeposits = (address) => {
    return new Promise((resolve, reject) => {
      queryAaveSubgraph(address)
        .then((resp) => {
  
          let deposits = 0;
          if (resp) {
            if (resp.depositHistory) {
  
              for (let i = 0; i < resp.depositHistory.length; i++) {
                deposits +=
                  ((resp.depositHistory[i].amount / 10 ** 18) *
                    resp.depositHistory[i].reserve.price.priceInEth) /
                  resp.depositHistory[i].reserve.price.oracle.usdPriceEth;
              }
            }
          }
          resolve(deposits);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  };
  
  /**
   * Gets data about each debt taken
   * TODO: Implementation
   * @param {*} address
   * @returns
   */
  exports.getDebtHistory = (address) => {
    return new Promise((resolve, reject) => {
      queryAaveSubgraph(address)
        .then((resp) => {
          let debt = 0;
          for (let i = 0; i < resp.borrowHistory.length; i++) {
            if (resp.borrowHistory[i].reserve.symbol == "BUSD") {
              console.log(
                resp.borrowHistory[i].amount / 10 ** 18,
                resp.borrowHistory[i].reserve.symbol,
                resp.borrowHistory[i].reserve.price.priceInEth /
                resp.borrowHistory[i].reserve.price.oracle.usdPriceEth
              );
              debt +=
                ((resp.borrowHistory[i].amount / 10 ** 18) *
                  resp.borrowHistory[i].reserve.price.priceInEth) /
                resp.borrowHistory[i].reserve.price.oracle.usdPriceEth;
            }
          }
          console.log(debt);
          debt = 0;
          console.log("===Repay===");
          for (let i = 0; i < resp.repayHistory.length; i++) {
            if (resp.repayHistory[i].reserve.symbol == "BUSD") {
              console.log(
                resp.repayHistory[i].amount / 10 ** 18,
                resp.repayHistory[i].reserve.symbol,
                resp.repayHistory[i].reserve.price.priceInEth /
                resp.repayHistory[i].reserve.price.oracle.usdPriceEth
              );
              debt +=
                ((resp.repayHistory[i].amount / 10 ** 18) *
                  resp.repayHistory[i].reserve.price.priceInEth) /
                resp.repayHistory[i].reserve.price.oracle.usdPriceEth;
            }
          }
          console.log(debt);
          // resolve(debt);
        })
        .catch((err) => {
          console.log(err);
          reject(err.response.data);
        });
    });
  };
  