const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/propertyController');

router.get('/', ctrl.getAllProperties);
router.get('/seed', ctrl.seedProperties);
router.get('/:id', ctrl.getProperty);
router.post('/', ctrl.createProperty);

module.exports = router;
