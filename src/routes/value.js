const express = require('express');

const router = express.Router();

const { getFTValuation, getTotalValuation, getFTBalances, getAllBalances } = require('../indexing/valuation');

router.get('/FT/:address', async (req, res) => {
    getFTValuation(req.params.address)
    .then(result => {
        res.send(result);
    })
});

router.get('/total/:address', (req, res) => {
    getTotalValuation(req.params.address)
    .then(result => {
        res.send(result);
    })
});

router.get('/FT_balances/:address', (req, res) => {
    getFTBalances(req.params.address)
    .then(result => {
        res.send(result);
    })
});

router.get('/total_balances/:address', (req, res) => {
    getAllBalances(req.params.address)
    .then(result => {
        res.send(result);
    })
});

module.exports = router;

/**
 * getTotalValuation()
 * totalERC20TokensHolding()
 * totalNFTsHolding()
 */