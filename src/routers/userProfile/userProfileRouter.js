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
} = require('../../controllers/userProfileController');

// Middleware for authentication (you may need to adjust this based on your auth middleware)
const auth = require('../../middleware/auth');
const { uploadResume, uploadVideo, uploadImage } = require('../../middleware/upload');

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

// Profile picture upload (multipart field: avatar)
router.post('/personal-details/profile-picture', uploadImage.single('avatar'), require('../../controllers/userProfileController').uploadProfilePicture);

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

// Experience routes
router.route('/experience')
  .put(updateExperience); // PUT /api/user-profile/experience
router.post('/experience/add', addExperience); // POST /api/user-profile/experience/add
router.delete('/experience/:id', deleteExperience); // DELETE /api/user-profile/experience/:id

// Projects routes
router.route('/projects')
  .put(updateProjects); // PUT /api/user-profile/projects
router.post('/projects/add', addProject); // POST /api/user-profile/projects/add
router.delete('/projects/:id', deleteProject); // DELETE /api/user-profile/projects/:id

// Resume routes (multipart upload)
router.post('/resume', uploadResume.single('resume'), updateResume); // field name: resume
router.delete('/resume', deleteResume);

// Video Resume routes (multipart upload)
router.post('/video-resume', uploadVideo.single('video'), updateVideoResume); // field name: video
router.delete('/video-resume', deleteVideoResume);

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

