'use strict';

const express = require('express');

const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('landing');
});

module.exports = router;