require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(helmet());
// Allow the frontend dev server origins (Vite often runs on 5173 or 5174)
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:5174'].filter(Boolean);
app.use(cors({ origin: (origin, cb) => {
  // allow requests with no origin (like curl, mobile apps)
  if (!origin) return cb(null, true);
  if (allowedOrigins.indexOf(origin) !== -1) return cb(null, true);
  cb(new Error('CORS: Not allowed by CORS'));
}, credentials: true }));
app.use(express.json());

// Basic rate limiter
const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Mount API
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);

// Health
app.get('/api/health', (req, res) => res.json({ success: true, message: 'OK' }));

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
