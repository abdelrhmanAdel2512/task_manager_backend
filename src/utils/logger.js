'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

const isDev = process.env.NODE_ENV !== 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack }) =>
    stack ? `[${timestamp}] ${level}: ${message}\n${stack}` : `[${timestamp}] ${level}: ${message}`
  )
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  format.json()
);

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  format: isDev ? devFormat : prodFormat,
  transports: [
    new transports.Console(),
    ...(isDev ? [] : [
      new transports.File({ filename: 'logs/error.log', level: 'error' }),
      new transports.File({ filename: 'logs/combined.log' }),
    ]),
  ],
  silent: process.env.NODE_ENV === 'test',
});

module.exports = logger;
