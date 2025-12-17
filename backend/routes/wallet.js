const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');

const router = express.Router();

/* ======================
   REQUEST WITHDRAWAL (USER)
====================== */
router.post('/withdraw', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: 'Invalid amount' });

    if (req.user.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });

    const withdrawal = await Withdrawal.create({
      user: req.user._id,
      amount,
      status: 'pending',
    });

    res.status(201).json({ message: 'Withdrawal requested', withdrawal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   GET USER WITHDRAWALS
====================== */
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id });
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: GET ALL WITHDRAWALS
====================== */
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find().populate('user', 'name email');
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: APPROVE WITHDRAWAL
====================== */
router.put('/approve/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id).populate('user');
    if (!withdrawal)
      return res.status(404).json({ message: 'Withdrawal not found' });

    if (withdrawal.status !== 'pending')
      return res.status(400).json({ message: 'Withdrawal already processed' });

    if (withdrawal.user.balance < withdrawal.amount)
      return res.status(400).json({ message: 'User has insufficient balance' });

    // Deduct from user balance
    withdrawal.user.balance -= withdrawal.amount;
    await withdrawal.user.save();

    withdrawal.status = 'approved';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.json({ message: 'Withdrawal approved', withdrawal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

/* ======================
   ADMIN: REJECT WITHDRAWAL
====================== */
router.put('/reject/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal)
      return res.status(404).json({ message: 'Withdrawal not found' });

    if (withdrawal.status !== 'pending')
      return res.status(400).json({ message: 'Withdrawal already processed' });

    withdrawal.status = 'rejected';
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.json({ message: 'Withdrawal rejected', withdrawal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
