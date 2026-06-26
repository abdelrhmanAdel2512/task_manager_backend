'use strict';

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info(`✅ MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
};

module.exports = connectDB;
