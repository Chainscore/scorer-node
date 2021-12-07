const { getBorrowPosition, getSupplyPosition, getTotalRepaymentHistory, getTotalBorrowHistory } = require("./credit");
// const { getBorrowPosition, getSupplyPosition } = require("./credit");

const { total_balances } = require("./value");
const { getSpotPrice } = require("../indexing/prices-endpoint")

const { log } = require('mathjs');

/**
 * score = (
 *      0.3*log(total_value+1, ETH_PRICE) +
 *      0.2*(total_supplied)/((total_value) - (total_supplied)) +
 *      0.3*(total_borrowed <<>> total_repaid)
 *      0.2*(total_repaid)
 * )
 * 
 * data available:
 *      - total valuation
 *      - total supplied
 *      - total current supplied
 *      - total borrowed
 *      - total current borrowed
 *      - total repaid
 * @param {*} account 
 */
exports.getScore = async (account) => {
    let total_value = (await total_balances(account)).total;

    let total_supplied = (await getSupplyPosition(account)).total_supplied;
    let total_borrowed = (await getBorrowPosition(account)).total_borrowed;

    // data from aave & comp indexers
    let total_borrowed_history = (await getTotalBorrowHistory(account)).total_borrowed; 
    let total_repaid_history = (await getTotalRepaymentHistory(account)).total_repaid;

    console.log(total_borrowed_history, total_repaid_history);

    /**
     * Valuation
     * total_value UP (till LIMIT) ==>> score UP
     */
    let normalized_value = await getSpotPrice("ETH");
    let value_score = log(total_value+1, normalized_value.items[0].quote_rate);
    console.log(`Value Score: ${value_score}`);

    /**
     * Credit Supplied
     * total_supplied UP ==>> score UP
     */
    let supply_score = (total_supplied)/((total_value) - (total_supplied));
    console.log(`Supply Score: ${supply_score}`);

    /**
     * Repayment
     * total_borrow_history UP && 
     */
    let repayment_score = (total_borrowed_history)/((total_borrowed_history) - (total_repaid_history));

    /**
     * Borrowed <<>> Repayments
     * 
     * total_borrowed UP total_repaid UP ==>> score UP
     * total_borrowed UP total_repaid DOWN ==>> score DOWN
     * (total_borrowed)*(total_repaid)/()
     */
    let debt_score = (total_borrowed)/((total_borrowed) - (total_repaid_history));

    let score = 0.5*(value_score) + 0.2*(supply_score) + 0.2*(debt_score) + 0.1*(repayment_score);
    console.log("Score: ", score);

    return {score, supply_score, value_score, debt_score, repayment_score}
}

// this.getScore("0x8aceab8167c80cb8b3de7fa6228b889bb1130ee8")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

  this.getScore("0x1D052CC8C480B98Cc9BDb24e5F0586d47F9bd4CA")
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });

  