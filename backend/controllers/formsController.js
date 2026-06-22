const DamageReport = require('../models/DamageReport');
const KeyOrder = require('../models/KeyOrder');
const TenantChange = require('../models/TenantChange');
const { validationResult } = require('express-validator');

// --- Damage Report ---
exports.submitDamageReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const report = await DamageReport.create(req.body);
    res.status(201).json({ success: true, message: 'Damage report submitted successfully.', data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllDamageReports = async (req, res) => {
  try {
    const reports = await DamageReport.find().sort({ createdAt: -1 });
    res.json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Key Order ---
exports.submitKeyOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const order = await KeyOrder.create(req.body);
    res.status(201).json({ success: true, message: 'Key order submitted successfully.', data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllKeyOrders = async (req, res) => {
  try {
    const orders = await KeyOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Tenant Change ---
exports.submitTenantChange = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  try {
    const change = await TenantChange.create(req.body);
    res.status(201).json({ success: true, message: 'Tenant change submitted successfully.', data: change });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllTenantChanges = async (req, res) => {
  try {
    const changes = await TenantChange.find().sort({ createdAt: -1 });
    res.json({ success: true, count: changes.length, data: changes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
