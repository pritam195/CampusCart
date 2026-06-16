const express = require('express');
const router = express.Router();
const {
    createConversation,
    getConversations,
    getMessages,
    sendMessage,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/conversations', protect, createConversation);
router.get('/conversations', protect, getConversations);
router.get('/messages/:conversationId', protect, getMessages);
router.post('/messages', protect, sendMessage);

module.exports = router;
