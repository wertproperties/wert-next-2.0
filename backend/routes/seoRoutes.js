const express = require('express');
const multer = require('multer');
const router = express.Router();
const ctrl = require('../controllers/seoController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const name = (file.originalname || '').toLowerCase();
    const ok =
      name.endsWith('.csv') ||
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/octet-stream' ||
      file.mimetype === 'text/plain';
    if (!ok) return cb(new Error('Only .csv files are allowed'));
    cb(null, true);
  },
});

// Public
router.get('/', ctrl.getAllSeo);

// Admin CSV + seed (before /:slug)
router.get('/export', protect, adminOnly, ctrl.exportSeoCsv);
router.get('/template', protect, adminOnly, ctrl.downloadSeoTemplate);
router.post('/import', protect, adminOnly, upload.single('file'), ctrl.importSeoCsv);
router.post('/seed', protect, adminOnly, ctrl.seedSeo);

// Public single
router.get('/:slug', ctrl.getSeoBySlug);

// Admin update
router.put('/:slug', protect, adminOnly, ctrl.updateSeo);

module.exports = router;
