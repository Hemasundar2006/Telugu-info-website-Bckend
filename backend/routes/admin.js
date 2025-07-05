const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendApprovalEmail } = require('../config/email');
const { verifyAdmin } = require('../middleware/auth');

router.get('/pending-users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({ isVerified: false });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.patch('/verify-user/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    try {
      await sendApprovalEmail(user.email, user.name);
    } catch (emailErr) {
      return res.status(500).json({ success: false, message: 'User verified, but failed to send email', error: emailErr.message });
    }
    res.json({ success: true, message: 'User verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.delete('/reject-user/:id', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User rejected and deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

router.get('/user-stats', verifyAdmin, async (req, res) => {
  try {
    const total = await User.countDocuments();
    const pending = await User.countDocuments({ isVerified: false });
    const verified = await User.countDocuments({ isVerified: true });
    res.json({
      success: true,
      stats: {
        total,
        pending,
        verified
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router; 