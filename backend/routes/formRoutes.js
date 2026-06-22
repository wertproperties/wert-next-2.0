const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/formsController');

// Damage Report
router.post('/damage', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('address').notEmpty(),
  body('damageType').notEmpty(),
  body('description').isLength({ min: 10 }),
], ctrl.submitDamageReport);
router.get('/damage', ctrl.getAllDamageReports);

// Key Order
router.post('/key', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('address').notEmpty(),
  body('keyType').notEmpty(),
  body('quantity').isInt({ min: 1 }),
], ctrl.submitKeyOrder);
router.get('/key', ctrl.getAllKeyOrders);

// Tenant Change
router.post('/tenant-change', [
  body('property').notEmpty(),
  body('unit').notEmpty(),
  body('ownerName').notEmpty(),
  body('ownerEmail').isEmail(),
], ctrl.submitTenantChange);
router.get('/tenant-change', ctrl.getAllTenantChanges);

module.exports = router;
