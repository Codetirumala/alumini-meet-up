const express = require('express');
const {
  createOrUpdateProfile,
  getMyProfile,
  uploadProfileAsset,
} = require('../controllers/studentController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    const type = (req.query.type || '').toLowerCase();
    const isImage = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    const isPdf = file.mimetype === 'application/pdf';
    if ((type === 'image' || type === 'banner') && isImage) return cb(null, true);
    if (type === 'resume' && isPdf) return cb(null, true);
    cb(new Error('Invalid file type'));
  }
});

// Student only
router.post(
  '/profile',
  protect,
  authorizeRoles('student'),
  createOrUpdateProfile
);

router.get(
  '/profile',
  protect,
  authorizeRoles('student'),
  getMyProfile
);

// Upload profile asset (image or resume)
router.post(
  '/profile/upload',
  protect,
  authorizeRoles('student'),
  upload.single('file'),
  uploadProfileAsset
);

module.exports = router;
