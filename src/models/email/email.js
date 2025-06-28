const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    }
}, {
    timestamps: true
});

// Create index for email field
emailSchema.index({ email: 1 }, { unique: true });

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;