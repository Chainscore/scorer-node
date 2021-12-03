const { getBorrowPosition, getSupplyPosition } = require("./credit");
// const { getBorrowPosition, getSupplyPosition } = require("./credit");

const { total_balances } = require("./value");
const { getSpotPrice } = require("../indexing/prices-endpoint")

const { log } = require('mathjs');

/**
 * score = (
 *      0.3*log(total_value) +
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

    /**
     * Valuation
     * total_value UP ==>> score UP
     */
    let normalized_value = await getSpotPrice("ETH");
    let value_score = log(total_value, normalized_value.items[0].quote_rate);
    console.log(`Value Score: ${value_score}`);

    /**
     * Credit Supplied
     * total_supplied UP ==>> score UP
     */
    let supply_score = (total_supplied)/((total_value) - (total_supplied));
    console.log(`Supply Score: ${supply_score}`);

    /**
     * Repayment
     */
    let repayment_score = 0;

    /**
     * Borrowed <<>> Repayments
     * 
     * total_borrowed UP total_repaid UP ==>> score UP
     * total_borrowed UP total_repaid DOWN ==>> score DOWN
     */
    let debt_score = 0;

    let score = 0.5*(value_score) + 0.2*(supply_score) + 0.2*(debt_score) + 0.1*(repayment_score);
    console.log("Score: ", score);

    return {score, supply_score, value_score, debt_score, repayment_score}

}