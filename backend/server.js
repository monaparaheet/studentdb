require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Determine database mode: Neon Postgres vs MongoDB Atlas
const isPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

let connectDB = null;
let mongoose = null;
let neonDb = null;
let isPostgresReady = false;

if (isPostgres) {
  console.log('🐘 Initializing Neon PostgreSQL Driver...');
  neonDb = require('./config/neonDb');
  neonDb.initNeonDB().then((ready) => {
    isPostgresReady = ready;
  });
} else {
  console.log('🍃 Initializing MongoDB Atlas Mongoose Driver...');
  mongoose = require('mongoose');
  connectDB = require('./config/db');
  connectDB();
}

// CORS configuration - support localhost, Vercel, Netlify, Render
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== 'production' ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive during demos
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Root / Health check route (used by Render/Vercel uptime monitors)
app.get('/', (req, res) => {
  let dbInfo = {};

  if (isPostgres) {
    dbInfo = {
      provider: 'Neon PostgreSQL (Serverless)',
      status: isPostgresReady ? 'connected' : 'connecting'
    };
  } else if (mongoose) {
    const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    dbInfo = {
      provider: 'MongoDB Atlas',
      status: dbStatusMap[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host || 'not connected'
    };
  }

  res.status(200).json({
    status: 'online',
    service: 'Student Information Portal API',
    environment: process.env.NODE_ENV || 'development',
    serverless: Boolean(process.env.VERCEL),
    cloudDatabase: dbInfo,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    endpoints: {
      getStudents: 'GET /students (or /api/students)',
      getStudentById: 'GET /students/:id',
      createStudent: 'POST /students',
      updateStudent: 'PUT /students/:id',
      deleteStudent: 'DELETE /students/:id',
      stats: 'GET /students/stats'
    }
  });
});

app.get('/health', (req, res) => {
  const isHealthy = isPostgres ? isPostgresReady : (mongoose && mongoose.connection.readyState === 1);
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    database: isPostgres ? 'Neon PostgreSQL' : 'MongoDB Atlas',
    connected: isHealthy,
    timestamp: new Date().toISOString()
  });
});

// Fast-fail middleware: Alert caller immediately if database credentials missing
const checkDbConnection = (req, res, next) => {
  if (isPostgres) {
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      return res.status(503).json({
        success: false,
        message: 'Neon PostgreSQL DATABASE_URL is missing. Please set DATABASE_URL in your environment variables.'
      });
    }
  } else if (mongoose) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'MongoDB Atlas is not connected yet. Please ensure MONGODB_URI is set and 0.0.0.0/0 is allowed in Atlas Network Access.'
      });
    }
  }
  next();
};

// Mount Student Routes (supporting both /students and /api/students)
const studentRoutes = require('./routes/studentRoutes');
app.use('/students', checkDbConnection, studentRoutes);
app.use('/api/students', checkDbConnection, studentRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Start Server locally or in container (if not inside Vercel Serverless environment)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Student Portal API Server running on port ${PORT}`);
    console.log(`💾 Active Database: ${isPostgres ? 'Neon PostgreSQL' : 'MongoDB Atlas'}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/health`);
    console.log(`📚 Students Endpoint: http://localhost:${PORT}/students`);
    console.log(`====================================================`);
  });
}

// Export app for Vercel Serverless Function execution
module.exports = app;
