'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const routes = require('./routes/index');
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const logger = require('./utils/logger');

const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ─── HTTP logging ─────────────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: () => process.env.NODE_ENV === 'test',
  })
);

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'OK', uptime: process.uptime() });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/v1', routes);

// ─── Error handlers (must be last) ───────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
