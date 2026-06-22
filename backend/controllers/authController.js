const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'wert_secret_key_2024', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

// POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { firstName, lastName, email, password, phone, address, unit, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    // Only allow admin creation if there are no admins yet OR request comes from existing admin
    const assignedRole = role === 'admin' ? 'owner' : (role || 'owner');

    const user = await User.create({ firstName, lastName, email, password, phone, address, unit, role: assignedRole });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated. Contact admin.' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, unit } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, address, unit }, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    const match = await user.matchPassword(req.body.currentPassword);
    if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' });

    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- ADMIN ONLY ----

// GET /api/auth/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/auth/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/auth/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/admin/create  (admin creates a user with any role)
exports.adminCreateUser = async (req, res) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    const Contact = require('../models/Contact');
    const DamageReport = require('../models/DamageReport');
    const KeyOrder = require('../models/KeyOrder');
    const TenantChange = require('../models/TenantChange');
    const Property = require('../models/Property');

    const [users, contacts, damages, keys, tenants, properties] = await Promise.all([
      User.countDocuments(),
      Contact.countDocuments(),
      DamageReport.countDocuments(),
      KeyOrder.countDocuments(),
      TenantChange.countDocuments(),
      Property.countDocuments(),
    ]);

    const newContacts = await Contact.countDocuments({ status: 'new' });
    const pendingDamages = await DamageReport.countDocuments({ status: 'submitted' });
    const pendingKeys = await KeyOrder.countDocuments({ status: 'pending' });
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: { users, contacts, damages, keys, tenants, properties, newContacts, pendingDamages, pendingKeys, recentContacts },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
