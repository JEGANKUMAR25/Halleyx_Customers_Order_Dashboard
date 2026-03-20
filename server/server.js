const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const ordersRouter = require('./routes/orders');
const widgetsRouter = require('./routes/widgets');
const aiRouter = require('./routes/ai');

app.use('/api/orders', ordersRouter);
app.use('/api/widgets', widgetsRouter);
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    status: 'ok',
    message: 'Server is running',
    db: states[dbState] || 'unknown',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected from MongoDB. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed. Server shutting down.');
  process.exit(0);
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file. Please add your MongoDB Atlas connection string.');
  process.exit(1);
}

const mongoOptions = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s if Atlas not reachable
  socketTimeoutMS: 45000,          // Close sockets after 45s of inactivity
  connectTimeoutMS: 10000,         // Timeout the initial connection after 10s
};

mongoose
  .connect(MONGODB_URI, mongoOptions)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
