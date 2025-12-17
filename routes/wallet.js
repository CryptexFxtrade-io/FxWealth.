const express = require('express');
const router = express.Router();

// Example wallet route
router.get('/test', (req, res) => {
  res.json({ message: 'Wallet route working' });
});

module.exports = router;
