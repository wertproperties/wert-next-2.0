/**
 * Seed / ensure PageSeo defaults.
 * Usage (from backend/): node scripts/seedSeo.js
 * Requires MONGODB_URI (or MONGO_URI) in env / .env
 */
require('dotenv').config();
const connectDB = require('../config/database');
const { ensureSeoDefaults } = require('../controllers/seoController');
const PageSeo = require('../models/PageSeo');

(async () => {
  try {
    await connectDB();
    await ensureSeoDefaults();
    const entries = await PageSeo.find().sort({ slug: 1 });
    console.log(`SEO seed complete: ${entries.length} entries`);
    entries.forEach((e) => console.log(`  - ${e.slug}`));
    process.exit(0);
  } catch (err) {
    console.error('SEO seed failed:', err.message);
    process.exit(1);
  }
})();
