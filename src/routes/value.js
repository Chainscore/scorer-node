const express = require('express');
const router = express.Router();

const { ftBalances, total_balances } = require("../controllers/value");

router.get('/ft/:address', (req, res) => {
    ftBalances(req.params.address)
    .then(result => {
        res.send({...result})
    })
});

router.get('/total/:address', (req, res) => {
    total_balances(req.params.address)
    .then(result => {
        res.send({...result})
    })
});

module.exports = router;