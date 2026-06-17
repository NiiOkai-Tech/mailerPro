require('dotenv').config();

module.exports = {
  server: {
    port: process.env.API_PORT || 3000,
    apiKey: process.env.API_KEY,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  email: {
    fromName: process.env.EMAIL_FROM_NAME || 'MailerPro',
    fromAddress: process.env.EMAIL_FROM_ADDRESS,
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  },
  retry: {
    maxAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3'),
    delayMs: parseInt(process.env.RETRY_DELAY_MS || '1000'),
  },
};
