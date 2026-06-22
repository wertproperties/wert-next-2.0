// const ChatMessage = require('../models/ChatMessage');

// // ─── USER (Public) ────────────────────────────────────────────────

// // POST /api/chat/message
// // User sends a message from chatbot widget
// exports.sendMessage = async (req, res) => {
//   try {
//     const { sessionId, text, visitorName, visitorEmail } = req.body;
//     if (!sessionId || !text) {
//       return res.status(400).json({ success: false, message: 'sessionId and text are required' });
//     }

//     const msg = await ChatMessage.create({
//       sessionId,
//       role: 'user',
//       text: text.trim(),
//       visitorName: visitorName || 'Visitor',
//       visitorEmail: visitorEmail || '',
//     });

//     res.status(201).json({ success: true, data: msg });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/chat/messages/:sessionId
// // User polls for new messages in their session (both own + admin replies)
// exports.getSessionMessages = async (req, res) => {
//   try {
//     const { sessionId } = req.params;
//     const { after } = req.query; // ISO timestamp — only fetch messages after this

//     const filter = { sessionId };
//     if (after) filter.createdAt = { $gt: new Date(after) };

//     const messages = await ChatMessage.find(filter).sort({ createdAt: 1 });

//     // Mark user messages as read when admin fetches (handled in admin endpoint)
//     res.json({ success: true, data: messages });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


// // ─── ADMIN ────────────────────────────────────────────────────────

// // GET /api/chat/admin/sessions
// // Returns all unique sessions with latest message + unread count
// exports.getAllSessions = async (req, res) => {
//   try {
//     const sessions = await ChatMessage.aggregate([
//       // Sort newest first
//       { $sort: { createdAt: -1 } },
//       // Group by sessionId
//       {
//         $group: {
//           _id: '$sessionId',
//           lastMessage:   { $first: '$text' },
//           lastTime:      { $first: '$createdAt' },
//           visitorName:   { $first: '$visitorName' },
//           visitorEmail:  { $first: '$visitorEmail' },
//           unreadCount: {
//             $sum: {
//               $cond: [{ $and: [{ $eq: ['$role', 'user'] }, { $eq: ['$read', false] }] }, 1, 0]
//             }
//           },
//           totalMessages: { $sum: 1 },
//         },
//       },
//       { $sort: { lastTime: -1 } },
//     ]);

//     res.json({ success: true, data: sessions });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/chat/admin/session/:sessionId
// // Returns all messages for a session + marks user messages as read
// exports.getAdminSession = async (req, res) => {
//   try {
//     const { sessionId } = req.params;

//     // Mark all user messages in this session as read
//     await ChatMessage.updateMany(
//       { sessionId, role: 'user', read: false },
//       { $set: { read: true } }
//     );

//     const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
//     res.json({ success: true, data: messages });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // POST /api/chat/admin/reply
// // Admin sends a reply to a session
// exports.adminReply = async (req, res) => {
//   try {
//     const { sessionId, text } = req.body;
//     if (!sessionId || !text) {
//       return res.status(400).json({ success: false, message: 'sessionId and text required' });
//     }

//     const msg = await ChatMessage.create({
//       sessionId,
//       role: 'admin',
//       text: text.trim(),
//       visitorName: 'Admin',
//       read: true,
//     });

//     res.status(201).json({ success: true, data: msg });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // GET /api/chat/admin/unread-count
// // Quick count of total unread user messages across ALL sessions
// exports.getUnreadCount = async (req, res) => {
//   try {
//     const count = await ChatMessage.countDocuments({ role: 'user', read: false });
//     res.json({ success: true, count });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // DELETE /api/chat/admin/session/:sessionId
// // Admin deletes a session
// exports.deleteSession = async (req, res) => {
//   try {
//     await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
//     res.json({ success: true, message: 'Session deleted' });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


const ChatMessage = require('../models/ChatMessage');

// ─── AUTO-REPLY MESSAGE ───────────────────────────────────────────
const AUTO_REPLY_TEXT =
  'Vielen Dank für Ihre Kontaktaufnahme! Unser Team wird sich so schnell wie möglich bei Ihnen melden.\n\n' +
  'Thank you for contacting us! Our team will respond to you shortly.';

// ─── USER (Authenticated) ────────────────────────────────────────

// POST /api/chat/message
// Logged-in user sends a message from chatbot widget
exports.sendMessage = async (req, res) => {
  try {
    const { sessionId, text, visitorName, visitorEmail, userId } = req.body;
    if (!sessionId || !text) {
      return res.status(400).json({ success: false, message: 'sessionId and text are required' });
    }

    // Check if this is the FIRST message ever in this session
    const existingCount = await ChatMessage.countDocuments({ sessionId });
    const isFirstContact = existingCount === 0;

    // Save the user's message
    const msg = await ChatMessage.create({
      sessionId,
      role: 'user',
      text: text.trim(),
      visitorName: visitorName || 'Visitor',
      visitorEmail: visitorEmail || '',
      userId: userId || null,
    });

    // If first contact → send automatic welcome reply
    if (isFirstContact) {
      const autoReply = await ChatMessage.create({
        sessionId,
        role: 'admin',
        text: AUTO_REPLY_TEXT,
        visitorName: 'WERT Team',
        read: true,
      });

      // Return both messages so frontend can display the auto-reply immediately
      return res.status(201).json({ success: true, data: [msg, autoReply] });
    }

    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat/messages/:sessionId
// Logged-in user polls for messages in their session
exports.getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { after } = req.query;

    const filter = { sessionId };
    if (after) filter.createdAt = { $gt: new Date(after) };

    const messages = await ChatMessage.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ─── ADMIN ────────────────────────────────────────────────────────

// GET /api/chat/admin/sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage:   { $first: '$text' },
          lastTime:      { $first: '$createdAt' },
          visitorName:   { $first: '$visitorName' },
          visitorEmail:  { $first: '$visitorEmail' },
          userId:        { $first: '$userId' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$role', 'user'] }, { $eq: ['$read', false] }] }, 1, 0]
            }
          },
          totalMessages: { $sum: 1 },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat/admin/session/:sessionId
exports.getAdminSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await ChatMessage.updateMany(
      { sessionId, role: 'user', read: false },
      { $set: { read: true } }
    );
    const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/chat/admin/reply
exports.adminReply = async (req, res) => {
  try {
    const { sessionId, text } = req.body;
    if (!sessionId || !text) {
      return res.status(400).json({ success: false, message: 'sessionId and text required' });
    }
    const msg = await ChatMessage.create({
      sessionId,
      role: 'admin',
      text: text.trim(),
      visitorName: 'Admin',
      read: true,
    });
    res.status(201).json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/chat/admin/unread-count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await ChatMessage.countDocuments({ role: 'user', read: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/chat/admin/session/:sessionId
exports.deleteSession = async (req, res) => {
  try {
    await ChatMessage.deleteMany({ sessionId: req.params.sessionId });
    res.json({ success: true, message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
