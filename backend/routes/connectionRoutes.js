const express = require('express');
const {
  sendConnectionRequest,
  getConnectionStatus,
  acceptConnection,
  removeConnection,
  getMyConnections,
  getPendingRequests
} = require('../controllers/connectionController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send connection request
router.post('/request', sendConnectionRequest);

// Get connection status with a specific user
router.get('/status/:userId', getConnectionStatus);

// Accept connection
router.put('/accept/:connectionId', acceptConnection);

// Remove connection
router.delete('/:connectionId', removeConnection);

// Get my connections
router.get('/my-connections', getMyConnections);

// Get pending requests
router.get('/pending', getPendingRequests);

module.exports = router;
