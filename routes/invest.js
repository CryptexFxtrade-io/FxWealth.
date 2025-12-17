const express = require('express');
const router = express.Router();

// Example investment route
router.get('/test', (req, res) => {
  res.json({ message: 'Investment route working' });
});

module.exports = router;
