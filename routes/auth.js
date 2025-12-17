const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' });
});

module.exports = router;
