const {
  getBorrowPosition,
  getSupplyPosition,
  getTotalRepaymentHistory,
  getTotalBorrowHistory,
  getAllPositions,
} = require("./credit");
// const { getBorrowPosition, getSupplyPosition } = require("./credit");

const { total_balances } = require("./value");
const { getCoingeckoSpotPrice } = require("../indexing/prices-endpoint");

const { log } = require("mathjs");

/**
 * score = (
 *      0.3*log(total_value+1, ETH_PRICE) +
 *      0.2*log((total_supplied)/((total_value) - (total_supplied)), 100) +
 *      0.3*log((total_borrowed <<>> total_repaid), 100)
 *      0.2*log((total_repaid), ETH_PRICE)
 * )
 *
 * data available:
 *      - total valuation
 *      - total supplied history
 *      - current supplied
 *      - total borrowed history
 *      - current borrowed
 *      - total repaid history
 *      - total redeemed history
 * @param {*} account
 */
exports.getFullScore = async (account) => {
  try {
    account = account.toLowerCase();

    let value = await total_balances(account);
    let total_value = value.total;

    const {
      total_borrowed,
      current_borrowed,
      total_repaid,
      total_supplied,
      current_supplied,
      total_redeemed,
    } = await getAllPositions(account);

    console.log(total_borrowed,
      current_borrowed,
      total_repaid,
      total_supplied,
      current_supplied,
      total_redeemed);

    /**
     * Valuation
     * total_value UP (till LIMIT) ==>> score UP
     */
    let normalized_value = await getCoingeckoSpotPrice("ethereum");

    let eth_price = normalized_value.ethereum.usd;
    let value_score = log(total_value + 1, parseInt(eth_price));
    value_score = Math.abs(value_score.toFixed(16));
    console.log(`Value Score: ${value_score}`);

    /**
     * Credit Supplied
     * total_supplied UP ==>> score UP
     */
    let supply_score =
      total_supplied / Math.abs(total_value - total_supplied) || 0;
    supply_score = log(supply_score + 1, 100).toFixed(16);
    console.log(`Supply Score: ${supply_score}`);

    /**
     * Repayment
     * total_borrow_history UP &&
     */
    let repayment_score = total_repaid || 0;
    repayment_score = log(total_repaid + 1, eth_price);
    repayment_score = Math.abs(repayment_score.toFixed(16));
    console.log(`Repayment Score: ${repayment_score}`);

    /**
     * Borrowed <<>> Repayments
     *
     * total_borrowed UP total_repaid UP ==>> score UP
     * total_borrowed UP total_repaid DOWN ==>> score DOWN
     * (total_borrowed)*(total_repaid)/()
     */
    let debt_score =
      total_borrowed / Math.abs(total_borrowed - total_repaid) || 0;
    debt_score = log(debt_score + 1, 100).toFixed(16);
    console.log(`Debt Score: ${debt_score}`);

    let score =
      0.3 * value_score +
      0.3 * supply_score +
      0.2 * debt_score +
      0.2 * repayment_score;
    console.log("Score: ", score);

    return {
      address: account,
      score,
      supply_score,
      value_score,
      debt_score,
      repayment_score,
      credit: {
        total_borrowed,
        current_borrowed,
        total_repaid,
        total_supplied,
        current_supplied,
        total_redeemed,
      },
      value
    };
  } catch (err) {
    console.log(err);
    return {
      address: account,
      score: 0,
      supply_score: 0,
      value_score: 0,
      debt_score: 0,
      repayment_score: 0,
    };
  }
};

exports.getScore = async (account) => {
  let score = await this.getFullScore(account);
  return {
    address: score.address,
    score: score.score,
    supply_score: score.supply_score,
    value_score: score.value_score,
    debt_score: score.debt_score,
    repayment_score: score.repayment_score
  }
}

// this.getScore("0x933F12622c761B1bF5a4Ca444000F1d9C5D09e49")
//   .then((resp) => {
//     console.log(resp);
//   })
//   .catch((err) => {
//     console.log(err);
//   });