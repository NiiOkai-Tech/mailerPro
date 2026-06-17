const express = require('express');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');
const emailRateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/send', emailRateLimiter, async (req, res) => {
  try {
    const result = await emailService.sendEmail(req.body);
    logger.info('Email endpoint request successful', { to: req.body.to });
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    const statusCode = error.status || 500;
    logger.error('Email endpoint request failed', {
      to: req.body.to,
      error: error.message,
      statusCode,
    });
    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
});

router.post('/send-batch', emailRateLimiter, async (req, res) => {
  const { emails } = req.body;

  if (!Array.isArray(emails) || emails.length === 0) {
    logger.warn('Batch send request with invalid emails array');
    return res.status(400).json({
      success: false,
      message: 'emails array is required and must not be empty',
    });
  }

  const results = {
    success: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < emails.length; i++) {
    try {
      const result = await emailService.sendEmail(emails[i]);
      results.success += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push({
        index: i,
        to: emails[i].to,
        error: error.message,
      });
    }
  }

  const statusCode = results.failed === 0 ? 200 : 207;
  logger.info('Batch send completed', {
    total: emails.length,
    success: results.success,
    failed: results.failed,
  });

  return res.status(statusCode).json({
    success: results.failed === 0,
    message: `${results.success} of ${emails.length} emails sent successfully`,
    data: results,
  });
});

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
