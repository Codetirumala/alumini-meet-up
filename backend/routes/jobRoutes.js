const express = require('express');
const {
  createJob,
  getAllJobs,
  applyJob,
  getMyJobs,
  deleteJob
} = require('../controllers/jobController');

const { protect } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/roleMiddleware');

const router = express.Router();

// Alumni only
router.post(
  '/',
  protect,
  authorizeRoles('alumni'),
  createJob
);

// Student & Alumni
router.get(
  '/',
  protect,
  authorizeRoles('student', 'alumni', 'admin'),
  getAllJobs
);

// Student applies
router.post(
  '/apply/:id',
  protect,
  authorizeRoles('student'),
  applyJob
);

// Alumni get their own jobs
router.get(
  '/my-jobs',
  protect,
  authorizeRoles('alumni'),
  getMyJobs
);

// Alumni delete their job
router.delete(
  '/:id',
  protect,
  authorizeRoles('alumni'),
  deleteJob
);

module.exports = router;
