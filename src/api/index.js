const express = require('express');

const loves = require('./loves');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'API - 👋🌏'
  });
});

router.use('/loves', loves);

module.exports = router;
