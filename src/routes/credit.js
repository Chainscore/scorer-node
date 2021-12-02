const express = require("express");

const router = express.Router();

const { getSupplyPosition, getBorrowPosition } = require("../controllers/credit");

/**
 * DEBT
 */
router.get("/borrowed/total/:address", async (req, res) => {
    getBorrowPosition(req.params.address)
    .then(result => {
        res.send({...result});
    })
    .catch(err => {
        res.send({error: err.response})
    })
});

/**
 * DEPOSITS
 */
router.get("/supplied/total/:address", async (req, res) => {
  getSupplyPosition(req.params.address)
    .then(result => {
        res.send({...result});
    })
    .catch(err => {
        res.send({error: err.response})
    })
});

router.get("/supplied/history/:address", (req, res) => {
  res.send({ message: "Hello world" });
});

/**
 * REPAYMENTS
 */
router.get("/repayments/total/:address", (req, res) => {
  res.send({ message: "IN PROGRESS" });
});

router.get("/repayments/history/:address", (req, res) => {
  res.send({ message: "IN PROGRESS" });
});

/**
 * BALANCES
 */

router.get("/aave/balances/:address", (req, res) => {
  getAaveBalances(req.params.address).then((result) => {
    res.send({ ...result });
  });
});

router.get("/comp/balances/:address", (req, res) => {
  getCompBalances(req.params.address).then((result) => {
    res.send({ ...result });
  });
});


module.exports = router;