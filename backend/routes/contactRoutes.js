const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/contactController');

const validateContact = [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

router.post('/', validateContact, ctrl.submitContact);
router.get('/', ctrl.getAllContacts);
router.patch('/:id/status', ctrl.updateStatus);

module.exports = router;
