const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount,
  deleteConversation
} = require('../controllers/messageController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Send a message
router.post('/', sendMessage);

// Get all conversations
router.get('/conversations', getConversations);

// Get specific conversation
router.get('/conversation/:userId', getConversation);

// Mark messages as read
router.put('/read/:userId', markAsRead);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Delete conversation
router.delete('/conversation/:userId', deleteConversation);

module.exports = router;
