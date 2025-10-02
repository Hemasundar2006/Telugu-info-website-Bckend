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
  getAllProfiles
};

