require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Routes
const authRoutes     = require('./routes/authRoutes');
const contactRoutes  = require('./routes/contactRoutes');
const formRoutes     = require('./routes/formRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const chatRoutes     = require('./routes/chatRoutes');
const seoRoutes      = require('./routes/seoRoutes');

const app = express();

// Behind Vercel/Render/any proxy. Required so express-rate-limit reads the real
// client IP from X-Forwarded-For instead of throwing / rate-limiting everyone as one.
app.set('trust proxy', 1);

// --- CORS --------------------------------------------------------------------
// Browsers send the Origin header WITHOUT a trailing slash, so we strip slashes
// to avoid silent CORS failures (your FRONTEND_URL had a trailing slash).
const stripSlash = (u) => (u || '').trim().replace(/\/+$/, '');
const allowedOrigins = [
  stripSlash(process.env.FRONTEND_URL),
  'https://werthausverwaltung.de',
  'https://www.werthausverwaltung.de',
  'http://localhost:3000',
].filter(Boolean);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser clients (curl, health checks) that send no Origin.
      if (!origin) return cb(null, true);
      const clean = stripSlash(origin);
      let isVercelPreview = false;
      try {
        isVercelPreview = /\.vercel\.app$/.test(new URL(clean).hostname);
      } catch (_) {}
      if (allowedOrigins.includes(clean) || isVercelPreview) return cb(null, true);
      return cb(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
  })
);

// Make sure the database is connected before handling any API request.
// In serverless this guarantees a live (cached) connection per invocation and
// returns a clean 503 instead of a crash if Mongo is unreachable.
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: 'Database unavailable', error: err.message });
  }
});

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',       authRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/forms',      formRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/chat',       chatRoutes);
app.use('/api/seo',        seoRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// One-time admin seeding. PROTECTED: in production you must pass ?secret=<SEED_SECRET>.
app.get('/api/seed-admin', async (req, res) => {
  const seedAllowed =
    process.env.NODE_ENV !== 'production' ||
    (process.env.SEED_SECRET && req.query.secret === process.env.SEED_SECRET);
  if (!seedAllowed) return res.status(403).json({ error: 'Forbidden' });

  try {
    const User = require('./models/User');
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists', email: exists.email });
    const admin = await User.create({
      firstName: 'Admin', lastName: 'WERT', email: 'admin@wert.de',
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@123', role: 'admin',
    });
    res.json({ success: true, message: 'Admin created', email: admin.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(notFound);
app.use(errorHandler);

// Start a long-running server ONLY when run directly (local dev: `npm run dev`).
// On Vercel this file is imported by /api/index.js and invoked per-request, so
// app.listen() must NOT run there.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Chat API ready at /api/chat`);
  });
}

module.exports = app;
