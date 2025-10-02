const UserProfile = require('../models/userProfile/userProfile');
const User = require('../models/User');

/**
 * Create or Update User Profile
 */
const createOrUpdateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming auth middleware sets req.user
    const profileData = req.body;

    // Check if profile already exists
    let userProfile = await UserProfile.findOne({ userId });

    if (userProfile) {
      // Update existing profile
      userProfile = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: profileData },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      userProfile = new UserProfile({
        userId,
        ...profileData
      });
      await userProfile.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userProfile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

/**
 * Get User Profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userProfile = await UserProfile.findOne({ userId })
      .populate('userId', 'email');

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: userProfile
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

/**
 * Get Profile Summary
 */
const getProfileSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const userProfile = await UserProfile.findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const summary = userProfile.getProfileSummary();

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get profile summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile summary',
      error: error.message
    });
  }
};

/**
 * Update Personal Details
 */
const updatePersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const personalDetails = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { personalDetails } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Personal details updated successfully',
      data: userProfile.personalDetails
    });

  } catch (error) {
    console.error('Update personal details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update personal details',
      error: error.message
    });
  }
};

// Upload and set profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const fileName = req.file.originalname;
    const url = `/uploads/profile/${Date.now()}_${fileName}`;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { 'personalDetails.profilePicture': url } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Profile picture updated', data: userProfile.personalDetails.profilePicture });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload profile picture', error: error.message });
  }
};

/**
 * Update Contact Details
 */
const updateContactDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactDetails = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { contactDetails } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Contact details updated successfully',
      data: userProfile.contactDetails
    });

  } catch (error) {
    console.error('Update contact details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact details',
      error: error.message
    });
  }
};

/**
 * Update Academic Records
 */
const updateAcademicRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const academicRecords = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { academicRecords } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Academic records updated successfully',
      data: userProfile.academicRecords
    });

  } catch (error) {
    console.error('Update academic records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update academic records',
      error: error.message
    });
  }
};

/**
 * Add Qualification
 */
const addQualification = async (req, res) => {
  try {
    const userId = req.user.id;
    const qualification = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { 'academicRecords.qualifications': qualification } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Qualification added successfully',
      data: userProfile.academicRecords.qualifications
    });

  } catch (error) {
    console.error('Add qualification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add qualification',
      error: error.message
    });
  }
};



/**
 * Experience CRUD
 */
const updateExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const experience = req.body; // expects array

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { experience } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: userProfile.experience
    });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ success: false, message: 'Failed to update experience', error: error.message });
  }
};

const addExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const item = req.body; // single experience object

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { experience: item } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Experience added', data: userProfile.experience });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ success: false, message: 'Failed to add experience', error: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { experience: { _id: id } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Experience deleted', data: userProfile?.experience || [] });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete experience', error: error.message });
  }
};

/**
 * Projects CRUD
 */
const updateProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = req.body; // expects array

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { projects } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Projects updated successfully', data: userProfile.projects });
  } catch (error) {
    console.error('Update projects error:', error);
    res.status(500).json({ success: false, message: 'Failed to update projects', error: error.message });
  }
};

const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const project = req.body; // single project

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { projects: project } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Project added', data: userProfile.projects });
  } catch (error) {
    console.error('Add project error:', error);
    res.status(500).json({ success: false, message: 'Failed to add project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { projects: { _id: id } } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Project deleted', data: userProfile?.projects || [] });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project', error: error.message });
  }
};

/**
 * Resume and Video Resume (URL-based)
 */
const updateResume = async (req, res) => {
  try {
    const userId = req.user.id;
    // If file uploaded via multer, it will be available as req.file
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No resume file provided' });
    }

    // In a real app, upload req.file.buffer to cloud storage (S3, Cloudinary)
    // For now, simulate storing a generated URL
    const fileName = req.file.originalname;
    const url = `/uploads/resumes/${Date.now()}_${fileName}`;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { resume: { url, fileName, updatedAt: new Date() } } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Resume uploaded', data: userProfile.resume });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume', error: error.message });
  }
};

const deleteResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $unset: { resume: '' } },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Resume removed', data: userProfile?.resume || null });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume', error: error.message });
  }
};

const updateVideoResume = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const fileName = req.file.originalname;
    const url = `/uploads/video-resumes/${Date.now()}_${fileName}`;
    const durationSec = req.body.durationSec ? Number(req.body.durationSec) : undefined;
    const thumbnailUrl = req.body.thumbnailUrl;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { videoResume: { url, durationSec, thumbnailUrl, updatedAt: new Date() } } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({ success: true, message: 'Video resume uploaded', data: userProfile.videoResume });
  } catch (error) {
    console.error('Update video resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to update video resume', error: error.message });
  }
};

const deleteVideoResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $unset: { videoResume: '' } },
      { new: true }
    );
    res.status(200).json({ success: true, message: 'Video resume removed', data: userProfile?.videoResume || null });
  } catch (error) {
    console.error('Delete video resume error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete video resume', error: error.message });
  }
};

/**
 * Update Extracurricular Activities
 */
const updateExtracurricularActivities = async (req, res) => {
  try {
    const userId = req.user.id;
    const extracurricularActivities = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { extracurricularActivities } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Extracurricular activities updated successfully',
      data: userProfile.extracurricularActivities
    });

  } catch (error) {
    console.error('Update extracurricular activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update extracurricular activities',
      error: error.message
    });
  }
};

/**
 * Update Financial Information
 */
const updateFinancialInformation = async (req, res) => {
  try {
    const userId = req.user.id;
    const financialInformation = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { financialInformation } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Financial information updated successfully',
      data: userProfile.financialInformation
    });

  } catch (error) {
    console.error('Update financial information error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update financial information',
      error: error.message
    });
  }
};

/**
 * Update Emergency Contacts
 */
const updateEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const emergencyContacts = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { emergencyContacts } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Emergency contacts updated successfully',
      data: userProfile.emergencyContacts
    });

  } catch (error) {
    console.error('Update emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency contacts',
      error: error.message
    });
  }
};

/**
 * Add Emergency Contact
 */
const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const emergencyContact = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { emergencyContacts: emergencyContact } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: userProfile.emergencyContacts
    });

  } catch (error) {
    console.error('Add emergency contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add emergency contact',
      error: error.message
    });
  }
};

/**
 * Update Additional Information
 */
const updateAdditionalInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const additionalInfo = req.body;

    const userProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { additionalInfo } },
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Additional information updated successfully',
      data: userProfile.additionalInfo
    });

  } catch (error) {
    console.error('Update additional info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update additional information',
      error: error.message
    });
  }
};

/**
 * Delete Profile
 */
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await UserProfile.findOneAndDelete({ userId });

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile',
      error: error.message
    });
  }
};

/**
 * Get All Profiles (Admin only)
 */
const getAllProfiles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, filter } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { 'personalDetails.firstName': { $regex: search, $options: 'i' } },
        { 'personalDetails.lastName': { $regex: search, $options: 'i' } },
        { 'contactDetails.primaryPhone': { $regex: search, $options: 'i' } },
        { 'academicRecords.currentEducation.institution': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter functionality
    if (filter) {
      const filterObj = JSON.parse(filter);
      query = { ...query, ...filterObj };
    }

    const profiles = await UserProfile.find(query)
      .populate('userId', 'email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await UserProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: profiles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get all profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profiles',
      error: error.message
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getProfile,
  getProfileSummary,
  updatePersonalDetails,
  updateContactDetails,
  updateAcademicRecords,
  addQualification,
  updateExtracurricularActivities,
  updateFinancialInformation,
  updateEmergencyContacts,
  addEmergencyContact,
  updateAdditionalInfo,
  deleteProfile,
  getAllProfiles,
  updateExperience,
  addExperience,
  deleteExperience,
  updateProjects,
  addProject,
  deleteProject,
  updateResume,
  deleteResume,
  updateVideoResume,
  deleteVideoResume
  ,uploadProfilePicture
};

