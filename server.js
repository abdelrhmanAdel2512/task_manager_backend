'use strict';

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

// Connect to MongoDB (Mongoose buffers queries until connected)
connectDB().catch((err) => {
  logger.error('Failed to connect to MongoDB:', err.message);
  process.exit(1);
});

// For local testing (Vercel sets its own environment)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server running locally on port ${PORT}`);
  });
}

// Required for Vercel to work
module.exports = app;
