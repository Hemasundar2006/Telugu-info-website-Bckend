const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return 'SCHOL' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    title: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    scholarshipType: {
        type: String,
        enum: ["merit-based", "need-based", "research", "sports", "cultural", "other"],
        required: true
    },
    educationLevel: [{
        type: String,
        enum: ["high-school", "undergraduate", "postgraduate", "phd", "other"]
    }],
    fields: [{
        type: String
    }],
    benefits: [{
        type: String
    }],
    requirements: {
        type: String,
        required: true
    },
    applicationProcess: {
        type: String,
        required: true
    },
    applicationLink: {
        type: String
    },
    documents: [{
        type: String
    }],
    organizationLogo: {
        type: String
    },
    country: {
        type: String,
        required: true
    },
    renewalCriteria: {
        type: String
    },
    metaTitle: {
        type: String,
        default: function() {
            return `${this.title} Scholarship by ${this.organization} - Telugu Info`;
        }
    },
    metaDescription: {
        type: String,
        default: function() {
            return `${this.title} scholarship worth ${this.amount} by ${this.organization}. Deadline: ${this.applicationDeadline}. Apply now!`;
        }
    },
    ogImage: {
        type: String,
        default: function() {
            return this.organizationLogo || 'default-scholarship-share-image.jpg';
        }
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
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
