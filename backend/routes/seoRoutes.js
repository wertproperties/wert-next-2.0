const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/seoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.get('/', ctrl.getAllSeo);

// Admin seed (before /:slug)
router.post('/seed', protect, adminOnly, ctrl.seedSeo);

// Public single
router.get('/:slug', ctrl.getSeoBySlug);

// Admin update
router.put('/:slug', protect, adminOnly, ctrl.updateSeo);

module.exports = router;
