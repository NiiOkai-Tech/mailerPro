const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const authMiddleware = require('./middleware/auth');
const emailRoutes = require('./routes/email');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use((req, res, next) => {
  logger.debug('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Email API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/email', authMiddleware, emailRoutes);

app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

module.exports = app;
