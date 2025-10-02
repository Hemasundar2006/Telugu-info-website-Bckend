const multer = require('multer');
const path = require('path');

// In-memory storage; replace with diskStorage if you want local files
const storage = multer.memoryStorage();

const pdfFilter = (req, file, cb) => {
  const allowed = ['application/pdf'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only PDF files are allowed'));
};

const videoFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only MP4 or WebM videos are allowed'));
};

const limits = {
  resume: { fileSize: 5 * 1024 * 1024 }, // 5MB
  video: { fileSize: 100 * 1024 * 1024 } // 100MB
};

const uploadResume = multer({ storage, fileFilter: pdfFilter, limits: limits.resume });
const uploadVideo = multer({ storage, fileFilter: videoFilter, limits: limits.video });
// Images: jpg/jpeg/png, up to 5MB
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error('Only JPG or PNG images are allowed'));
};
const uploadImage = multer({ storage, fileFilter: imageFilter, limits: limits.resume });

module.exports = { uploadResume, uploadVideo, uploadImage };


