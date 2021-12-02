const { getBorrowPosition, getSupplyPosition } = require("./credit");
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

    let normalized_value = await getSpotPrice("ETH");
    let value_score = log(1000000000, normalized_value.items[0].quote_rate);
    console.log(`Value Score: ${value_score}`);
    let supply_score = (total_supplied)/((total_value) - (total_supplied));
    console.log(`Supply Score: ${supply_score}`);
}

this.getScore("0xc98F11DAAAC76D3ef368fDF54fbbA34FfD951976")
