const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Investment = require('../models/Investment');
const User = require('../models/User');

const router = express.Router();

/* ======================
   CREATE INVESTMENT (USER)
====================== */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { plan, amount, roi, durationDays } = req.body;

    if (!plan || !amount || !roi || !durationDays)
      return res.status(400).json({ message: 'All fields are required' });

    const investment = await Investment.create({
      user: req.user._id,
      plan,
      amount,
      roi,
      status: 'pending',
      startDate: null,
      endDate: null,
    });

    res.status(201).json({ message: 'Investment request created', investment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   GET USER INVESTMENTS
====================== */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: GET ALL INVESTMENTS
====================== */
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const investments = await Investment.find().populate('user', 'name email');
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: APPROVE INVESTMENT
====================== */
router.put('/approve/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id).populate('user');
    if (!investment)
      return res.status(404).json({ message: 'Investment not found' });

    if (investment.status !== 'pending')
      return res.status(400).json({ message: 'Investment already processed' });

    // Activate investment
    investment.status = 'active';
    investment.startDate = new Date();
    investment.endDate = new Date(Date.now() + 24 * 60 * 60 * 1000 *  // durationDays
      (req.body.durationDays || 30)); // default 30 days
    investment.profit = investment.amount * (investment.roi / 100);

    await investment.save();

    // Optionally, add to user's balance if immediate ROI
    // investment.user.balance += investment.profit; await investment.user.save();

    res.json({ message: 'Investment approved', investment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: REJECT INVESTMENT
====================== */
router.put('/reject/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment)
      return res.status(404).json({ message: 'Investment not found' });

    if (investment.status !== 'pending')
      return res.status(400).json({ message: 'Investment already processed' });

    investment.status = 'rejected';
    await investment.save();

    res.json({ message: 'Investment rejected', investment });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
