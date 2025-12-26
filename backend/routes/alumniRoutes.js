const express = require('express');
const multer = require('multer');
const {
  createOrUpdateProfile,
  getMyProfile,
  getAllAlumni,
  uploadProfileAsset,
  getAlumniStats
} = require('../controllers/alumniController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = {
      image: ['image/jpeg', 'image/png', 'image/webp'],
      resume: ['application/pdf'],
    };
    const type = req.query.type || 'image';
    if (allowedMimes[type]?.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${type}`), false);
    }
  },
});

// Alumni only
router.post(
  '/profile',
  protect,
  authorizeRoles('alumni'),
  createOrUpdateProfile
);

router.get(
  '/profile',
  protect,
  authorizeRoles('alumni'),
  getMyProfile
);

router.get(
  '/stats',
  protect,
  authorizeRoles('alumni'),
  getAlumniStats
);

router.post(
  '/profile/upload',
  protect,
  authorizeRoles('alumni'),
  upload.single('file'),
  uploadProfileAsset
);

// Student & Admin
router.get(
  '/all',
  protect,
  authorizeRoles('student', 'admin'),
  getAllAlumni
);

module.exports = router;
