const mongoose = require('mongoose');

const partTimeJobSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return 'PTJOB' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    title: {
        type: String,
        required: true
    },
    companyName: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    workMode: {
        type: String,
        enum: ["workFromHome", "workFromOffice", "Remote"],
        default: "workFromOffice"
    },
    weeklyHours: {
        type: Number
    },
    salary: {
        type: String
    },
    description: {
        type: String
    },
    requirements: {
        type: String
    },
    responsibilities: {
        type: String
    },
    applicationLink: {
        type: String
    },
    companyLogo: {
        type: String
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
    // SEO and sharing
    metaTitle: {
        type: String,
        default: function() {
            return `${this.title} (Part-time) at ${this.companyName || ''} | Telugu Info`;
        }
    },
    metaDescription: {
        type: String,
        default: function() {
            return `Part-time job: ${this.title} at ${this.companyName || 'Company'}. Location: ${this.location}.`;
        }
    },
    ogImage: {
        type: String,
        default: function() {
            return this.companyLogo || 'default-parttime-share-image.jpg';
        }
    },
    shareCount: { type: Number, default: 0 },
    shareableLink: { type: String, unique: true, sparse: true },
    socialShares: {
        whatsapp: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        facebook: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('PartTimeJob', partTimeJobSchema);


