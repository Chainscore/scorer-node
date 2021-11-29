const express = require('express');

const router = express.Router();

/**
 * totalDeposits()
 * depositHistory()
 * totalRepaid()
 * repaymentHistory()
 * totalDebtOwed()
 */

router.get('/debt/total/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

router.get('/debt/history/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

router.get('/deposits/total/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

router.get('/deposits/history/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

router.get('/repayments/total/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

router.get('/repayments/history/:address', (req, res) => {
    res.send({ message: 'Hello world' });
});

module.exports = router;