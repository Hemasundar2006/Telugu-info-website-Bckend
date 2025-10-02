const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  // Reference to the main user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },

  // Personal Details
  personalDetails: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say'],
      required: [true, 'Gender is required']
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      required: false
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      default: 'Indian'
    },
    religion: {
      type: String,
      required: false
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed'],
      default: 'single'
    },
    profilePicture: {
      type: String,
      required: false
    }
  },

  // Contact Details
  contactDetails: {
    primaryPhone: {
      type: String,
      required: [true, 'Primary phone number is required'],
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    secondaryPhone: {
      type: String,
      required: false,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    alternateEmail: {
      type: String,
      required: false,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    currentAddress: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      pincode: { 
        type: String, 
        required: [true, 'Pincode is required'],
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
      },
      country: { type: String, required: true, default: 'India' }
    },
    permanentAddress: {
      street: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      pincode: { 
        type: String, 
        required: false,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
      },
      country: { type: String, required: false, default: 'India' }
    },
    isPermanentSameAsCurrent: {
      type: Boolean,
      default: false
    }
  },

  // Academic Records
  academicRecords: {
    currentEducation: {
      institution: { type: String, required: false },
      course: { type: String, required: false },
      year: { type: String, required: false },
      semester: { type: String, required: false },
      rollNumber: { type: String, required: false },
      studentId: { type: String, required: false }
    },
    qualifications: [{
      degree: { type: String, required: true },
      institution: { type: String, required: true },
      yearOfPassing: { type: Number, required: true },
      percentage: { type: Number, required: false },
      cgpa: { type: Number, required: false },
      grade: { type: String, required: false },
      board: { type: String, required: false },
      isVerified: { type: Boolean, default: false }
    }],
    courses: [{
      courseName: { type: String, required: true },
      institution: { type: String, required: true },
      duration: { type: String, required: true },
      completionDate: { type: Date, required: false },
      certificate: { type: String, required: false },
      isCompleted: { type: Boolean, default: false }
    }],
    achievements: [{
      title: { type: String, required: true },
      description: { type: String, required: false },
      date: { type: Date, required: true },
      certificate: { type: String, required: false },
      level: { 
        type: String, 
        enum: ['school', 'college', 'university', 'state', 'national', 'international'],
        required: true
      }
    }]
  },


  // Extracurricular Activities and Interests
  extracurricularActivities: {
    sports: [{
      sportName: { type: String, required: true },
      level: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced', 'professional'],
        required: true
      },
      achievements: { type: String, required: false },
      startDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }],
    clubs: [{
      clubName: { type: String, required: true },
      role: { type: String, required: false },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }],
    hobbies: [{
      hobbyName: { type: String, required: true },
      description: { type: String, required: false },
      skillLevel: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      }
    }],
    volunteerWork: [{
      organization: { type: String, required: true },
      role: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: false },
      description: { type: String, required: false },
      hours: { type: Number, required: false },
      isActive: { type: Boolean, default: true }
    }],
    competitions: [{
      competitionName: { type: String, required: true },
      category: { type: String, required: true },
      position: { type: String, required: false },
      date: { type: Date, required: true },
      certificate: { type: String, required: false },
      level: { 
        type: String, 
        enum: ['school', 'college', 'university', 'state', 'national', 'international'],
        required: true
      }
    }]
  },

  // Financial Information
  financialInformation: {
    familyIncome: {
      annualIncome: { type: Number, required: false },
      incomeSource: { type: String, required: false },
      isBelowPovertyLine: { type: Boolean, default: false }
    },
    scholarships: [{
      scholarshipName: { type: String, required: true },
      amount: { type: Number, required: true },
      academicYear: { type: String, required: true },
      status: { 
        type: String, 
        enum: ['applied', 'approved', 'rejected', 'disbursed'],
        default: 'applied'
      },
      documents: [{ type: String }]
    }],
    feeStructure: {
      tuitionFee: { type: Number, required: false },
      otherFees: { type: Number, required: false },
      totalFee: { type: Number, required: false },
      paidAmount: { type: Number, default: 0 },
      pendingAmount: { type: Number, required: false },
      lastPaymentDate: { type: Date, required: false }
    },
    bankDetails: {
      accountNumber: { type: String, required: false },
      bankName: { type: String, required: false },
      ifscCode: { type: String, required: false },
      accountHolderName: { type: String, required: false }
    }
  },

  // Emergency Contact Details
  emergencyContacts: [{
    name: { type: String, required: true },
    relationship: { 
      type: String, 
      enum: ['father', 'mother', 'brother', 'sister', 'spouse', 'guardian', 'friend', 'other'],
      required: true
    },
    phone: { 
      type: String, 
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    email: { 
      type: String, 
      required: false,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    address: { type: String, required: false },
    isPrimary: { type: Boolean, default: false }
  }],

  // Additional Information
  additionalInfo: {
    languages: [{
      language: { type: String, required: true },
      proficiency: { 
        type: String, 
        enum: ['beginner', 'intermediate', 'advanced', 'native'],
        required: true
      }
    }],
    skills: [{ type: String }],
    socialMedia: {
      linkedin: { type: String, required: false },
      github: { type: String, required: false },
      twitter: { type: String, required: false },
      instagram: { type: String, required: false }
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true }
      },
      privacy: {
        showProfile: { type: Boolean, default: true },
        showContact: { type: Boolean, default: false },
        showAcademic: { type: Boolean, default: true }
      }
    }
  },

  // Application Tracking
  applications: {
    jobs: [{
      jobId: { type: String, required: true },
      jobTitle: { type: String, required: true },
      companyName: { type: String, required: true },
      appliedDate: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['applied', 'under-review', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied'
      },
      applicationMethod: { type: String, required: false }, // 'direct', 'referral', 'recruiter'
      notes: { type: String, required: false },
      interviewDate: { type: Date, required: false },
      salaryOffered: { type: String, required: false },
      responseDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }],
    internships: [{
      internshipId: { type: String, required: true },
      title: { type: String, required: true },
      companyName: { type: String, required: true },
      appliedDate: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['applied', 'under-review', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied'
      },
      applicationMethod: { type: String, required: false },
      notes: { type: String, required: false },
      interviewDate: { type: Date, required: false },
      stipendOffered: { type: String, required: false },
      responseDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }],
    scholarships: [{
      scholarshipId: { type: String, required: true },
      title: { type: String, required: true },
      organization: { type: String, required: true },
      appliedDate: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['applied', 'under-review', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied'
      },
      applicationMethod: { type: String, required: false },
      notes: { type: String, required: false },
      interviewDate: { type: Date, required: false },
      amountAwarded: { type: String, required: false },
      responseDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }],
    partTimeJobs: [{
      partTimeJobId: { type: String, required: true },
      title: { type: String, required: true },
      companyName: { type: String, required: true },
      appliedDate: { type: Date, default: Date.now },
      status: { 
        type: String, 
        enum: ['applied', 'under-review', 'shortlisted', 'interview-scheduled', 'rejected', 'accepted', 'withdrawn'],
        default: 'applied'
      },
      applicationMethod: { type: String, required: false },
      notes: { type: String, required: false },
      interviewDate: { type: Date, required: false },
      salaryOffered: { type: String, required: false },
      responseDate: { type: Date, required: false },
      isActive: { type: Boolean, default: true }
    }]
  },

  // Profile Status
  profileStatus: {
    isComplete: { type: Boolean, default: false },
    completionPercentage: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date, required: false }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userProfileSchema.index({ userId: 1 });
userProfileSchema.index({ 'personalDetails.firstName': 1, 'personalDetails.lastName': 1 });
userProfileSchema.index({ 'contactDetails.primaryPhone': 1 });
userProfileSchema.index({ 'academicRecords.currentEducation.institution': 1 });

// Virtual for full name
userProfileSchema.virtual('fullName').get(function() {
  return `${this.personalDetails.firstName} ${this.personalDetails.lastName}`;
});

// Virtual for age calculation
userProfileSchema.virtual('age').get(function() {
  if (!this.personalDetails.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalDetails.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to calculate profile completion
userProfileSchema.pre('save', function(next) {
  let completionScore = 0;
  const totalFields = 20; // Total number of important fields

  // Personal details (4 fields)
  if (this.personalDetails.firstName) completionScore++;
  if (this.personalDetails.lastName) completionScore++;
  if (this.personalDetails.dateOfBirth) completionScore++;
  if (this.personalDetails.gender) completionScore++;

  // Contact details (3 fields)
  if (this.contactDetails.primaryPhone) completionScore++;
  if (this.contactDetails.currentAddress.street) completionScore++;
  if (this.contactDetails.currentAddress.city) completionScore++;

  // Academic records (2 fields)
  if (this.academicRecords.qualifications.length > 0) completionScore++;
  if (this.academicRecords.currentEducation.institution) completionScore++;

  // Emergency contacts (1 field)
  if (this.emergencyContacts.length > 0) completionScore++;

  // Additional fields
  if (this.extracurricularActivities.sports.length > 0) completionScore++;
  if (this.extracurricularActivities.hobbies.length > 0) completionScore++;
  if (this.additionalInfo.languages.length > 0) completionScore++;
  if (this.additionalInfo.skills.length > 0) completionScore++;

  this.profileStatus.completionPercentage = Math.round((completionScore / totalFields) * 100);
  this.profileStatus.isComplete = this.profileStatus.completionPercentage >= 80;
  this.profileStatus.lastUpdated = new Date();

  next();
});

// Method to get profile summary
userProfileSchema.methods.getProfileSummary = function() {
  return {
    fullName: this.fullName,
    age: this.age,
    institution: this.academicRecords.currentEducation.institution,
    course: this.academicRecords.currentEducation.course,
    completionPercentage: this.profileStatus.completionPercentage,
    isComplete: this.profileStatus.isComplete,
    lastUpdated: this.profileStatus.lastUpdated
  };
};


const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;

