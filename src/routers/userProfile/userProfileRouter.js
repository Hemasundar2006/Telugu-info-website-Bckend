const express = require('express');
const router = express.Router();
const {
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
} = require('../../controllers/userProfileController');

// Middleware for authentication (you may need to adjust this based on your auth middleware)
const auth = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

// Main profile routes
router.route('/')
  .get(getProfile)                    // GET /api/user-profile - Get user profile
  .post(createOrUpdateProfile)        // POST /api/user-profile - Create/Update profile
  .delete(deleteProfile);             // DELETE /api/user-profile - Delete profile

// Profile summary
router.get('/summary', getProfileSummary);  // GET /api/user-profile/summary

// Personal details routes
router.route('/personal-details')
  .put(updatePersonalDetails);        // PUT /api/user-profile/personal-details

// Contact details routes
router.route('/contact-details')
  .put(updateContactDetails);         // PUT /api/user-profile/contact-details

// Academic records routes
router.route('/academic-records')
  .put(updateAcademicRecords);       // PUT /api/user-profile/academic-records

router.post('/qualifications', addQualification);  // POST /api/user-profile/qualifications


// Extracurricular activities routes
router.route('/extracurricular')
  .put(updateExtracurricularActivities);  // PUT /api/user-profile/extracurricular

// Financial information routes
router.route('/financial')
  .put(updateFinancialInformation);  // PUT /api/user-profile/financial

// Emergency contacts routes
router.route('/emergency-contacts')
  .put(updateEmergencyContacts)      // PUT /api/user-profile/emergency-contacts

router.post('/emergency-contacts/add', addEmergencyContact);  // POST /api/user-profile/emergency-contacts/add

// Additional information routes
router.route('/additional-info')
  .put(updateAdditionalInfo);        // PUT /api/user-profile/additional-info

// Admin routes (you may want to add admin middleware)
router.get('/admin/all', getAllProfiles);  // GET /api/user-profile/admin/all

module.exports = router;

