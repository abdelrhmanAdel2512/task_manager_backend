'use strict';

require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} [${process.env.NODE_ENV}]`);
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received — shutting down gracefully');
  process.exit(0);
});
