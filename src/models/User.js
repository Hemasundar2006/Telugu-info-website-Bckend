const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  resetToken: {
    type: String,
    default: null
  },
  resetTokenExpiry: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries on email and resetToken
userSchema.index({ email: 1 });
userSchema.index({ resetToken: 1 });

// Method to check if reset token is valid and not expired
userSchema.methods.isResetTokenValid = function() {
  return this.resetToken && this.resetTokenExpiry && this.resetTokenExpiry > Date.now();
};

// Method to clear reset token and expiry
userSchema.methods.clearResetToken = function() {
  this.resetToken = null;
  this.resetTokenExpiry = null;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 