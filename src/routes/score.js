const express = require('express');

const router = express.Router();

router.get('/score/:address', (req, res) => {
  res.send({ message: 'Hello world' });
});

router.get('/score/normalized/:address', (req, res) => {
  res.send({ message: 'Hello world' });
});

module.exports = router;