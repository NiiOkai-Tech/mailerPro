const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const emailService = require('./services/emailService');

async function startServer() {
  try {
    emailService.initializeTransporter();

    const isConnected = await emailService.verifySmtpConnection();
    if (!isConnected) {
      logger.warn('SMTP connection could not be verified. Proceeding with caution.');
    }

    app.listen(config.server.port, () => {
      logger.info('Email API Server started', {
        port: config.server.port,
        environment: config.server.nodeEnv,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', { error: error.message });
    process.exit(1);
  }
}

startServer();
