const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: function() {
            return 'INTERN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        }
    },
    title: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    stipend: {
        type: String,
        default: "Unpaid"
    },
    internshipType: {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
        default: "onsite"
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    responsibilities: {
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
    startDate: {
        type: Date,
        required: true
    },
    applicationLink: {
        type: String
    },
    skills: [{
        type: String
    }],
    perks: [{
        type: String
    }],
    companyLogo: {
        type: String
    },
    metaTitle: {
        type: String,
        default: function() {
            return `${this.title} Internship at ${this.companyName} - Telugu Info`;
        }
    },
    metaDescription: {
        type: String,
        default: function() {
            return `${this.duration} internship opportunity at ${this.companyName}. Location: ${this.location}, Type: ${this.internshipType}. Apply now!`;
        }
    },
    ogImage: {
        type: String,
        default: function() {
            return this.companyLogo || 'default-internship-share-image.jpg';
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

module.exports = mongoose.model('Internship', internshipSchema);
