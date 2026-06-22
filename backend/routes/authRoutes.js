const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/register', [
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
], ctrl.login);

// Protected
router.get('/me', protect, ctrl.getMe);
router.put('/profile', protect, ctrl.updateProfile);
router.put('/change-password', protect, ctrl.changePassword);

// Admin only
router.get('/admin/stats', protect, adminOnly, ctrl.getAdminStats);
router.get('/admin/users', protect, adminOnly, ctrl.getAllUsers);
router.post('/admin/create', protect, adminOnly, ctrl.adminCreateUser);
router.put('/admin/users/:id', protect, adminOnly, ctrl.updateUser);
router.delete('/admin/users/:id', protect, adminOnly, ctrl.deleteUser);

module.exports = router;
