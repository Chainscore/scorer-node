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


module.exports = router;