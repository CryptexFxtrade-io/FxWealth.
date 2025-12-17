const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

/* ======================
   GET ALL USERS
====================== */
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   BLOCK / UNBLOCK USER
====================== */
router.put('/user/:id/block', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? 'User blocked' : 'User unblocked',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   MAKE ADMIN
====================== */
router.put('/user/:id/make-admin', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
