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

const app = express();
connectDB();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',       authRoutes);
app.use('/api/contact',    contactRoutes);
app.use('/api/forms',      formRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/chat',       chatRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.get('/api/seed-admin', async (req, res) => {
  try {
    const User = require('./models/User');
    const exists = await User.findOne({ role: 'admin' });
    if (exists) return res.json({ message: 'Admin already exists', email: exists.email });
    const admin = await User.create({
      firstName: 'Admin', lastName: 'WERT', email: 'admin@wert.de',
      password: 'Admin@123', role: 'admin',
    });
    res.json({ success: true, message: 'Admin created', email: admin.email, password: 'Admin@123' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Chat API ready at /api/chat`);
});
