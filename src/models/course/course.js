const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        trim: true
    },
    tags: {
        type: [String],
        default: []
    },
    pricing: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        isFree: { type: Boolean, default: true }
    },
    videoDuration: {
        type: Number,
        default: 0 // in minutes
    },
    benefits: {
        type: [String],
        default: []
    },
    useCases: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        trim: true,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    pricing: {
        type: Number,
        default: 0
    },
    videoDuration: {
        type: Number,
        default: 0 // duration in minutes
    },
    preview: {
        title: { type: String },
        description: { type: String },
        image: { type: String },
        siteName: { type: String }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isShareable: {
        type: Boolean,
        default: true
    },
    shareCount: {
        type: Number,
        default: 0
    },
    shareableLink: {
        type: String,
        unique: true,
        sparse: true
    },
    socialShares: {
        whatsapp: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        facebook: { type: Number, default: 0 }
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    category: {
        type: String,
        default: ''
    },
    tags: {
        type: [String],
        default: []
    },
    pricing: {
        isFree: { type: Boolean, default: true },
        price: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        discountPercent: { type: Number, default: 0 }
    },
    video: {
        durationSeconds: { type: Number, default: 0 }
    },
    enrollments: {
        count: { type: Number, default: 0 },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);


