const express = require('express');
const router = express.Router();

const { ftBalances, totalBalances } = require("../controllers/value");

router.get('/ft_balances/:address', (req, res) => {
    ftBalances(req.params.address)
    .then(result => {
        res.send({...result})
    })
});

router.get('/total_balances/:address', (req, res) => {
    totalBalances(req.params.address)
    .then(result => {
        res.send({...result})
    })
});

module.exports = router;