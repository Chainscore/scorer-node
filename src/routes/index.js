const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`
    <div style="font-family: Arial; margin: 5%;">

    <h1 >ChainScore API Endpoint</h1>
    <p>Note: In Progress, with frequent breaking changes. Not to be used for production. </p>

    </div>
  `);
});

const { getScore, getFullScore } = require("../controllers/score");

router.get('/score', (req, res) => {
  getScore('0x'+req.body.address)
  .then((resp) => {
    res.send({...resp});
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});

router.get('/score/full', (req, res) => {
  getFullScore('0x'+req.body.address)
  .then((resp) => {
    res.send({...resp});
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});

router.get('/score/:address', (req, res) => {
  getScore(req.params.address)
  .then((resp) => {
    res.send({...resp});
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});

router.get('/score/full/:address', (req, res) => {
  getFullScore(req.params.address)
  .then((resp) => {
    res.send({...resp});
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  })
});

// router.get('/score/normalized/:address', (req, res) => {
//   res.send({ message: 'Hello world' });
// });

module.exports = router;