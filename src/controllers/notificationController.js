const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
  title: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  isGlobal: {
    type: Boolean,
    default: true // Set to true if you want global notifications by default
  },
  readBy: [{
    type: Schema.Types.ObjectId,
    ref: 'user' // Use lowercase if your user model is registered as 'user'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'user', // Use lowercase if your user model is registered as 'user'
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('notification', notificationSchema); // Use lowercase for consistency