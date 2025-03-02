const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { setupSolanaConnection } = require('./config/solana');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure CORS options
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply the CORS middleware with the specified options
app.use(cors(corsOptions));// Configure CORS options
const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply the CORS middleware with the specified options
app.use(cors(corsOptions));
app.use(express.json());

// Setup Solana connection
setupSolanaConnection();

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;