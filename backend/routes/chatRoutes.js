const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chatController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── Public (user/visitor) routes ──────────────────────────────────
router.post('/message', ctrl.sendMessage);                          // Send message from widget
router.get('/messages/:sessionId', ctrl.getSessionMessages);        // Poll for messages (user widget)

// ── Admin-only routes ─────────────────────────────────────────────
router.get('/admin/sessions', protect, adminOnly, ctrl.getAllSessions);          // List all chat sessions
router.get('/admin/session/:sessionId', protect, adminOnly, ctrl.getAdminSession); // Get full session + mark read
router.post('/admin/reply', protect, adminOnly, ctrl.adminReply);                // Admin reply
router.get('/admin/unread-count', protect, adminOnly, ctrl.getUnreadCount);      // Badge count
router.delete('/admin/session/:sessionId', protect, adminOnly, ctrl.deleteSession); // Delete session

module.exports = router;
