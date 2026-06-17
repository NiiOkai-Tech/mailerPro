const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const config = require('../config');
const { validateEmailPayload } = require('../utils/emailValidator');

let transporter;

function initializeTransporter() {
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.auth.user,
      pass: config.smtp.auth.pass,
    },
  });

  logger.info('SMTP transporter initialized', {
    host: config.smtp.host,
    port: config.smtp.port,
  });
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendEmailWithRetry(mailOptions, attempt = 1) {
  try {
    const result = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      messageId: result.messageId,
      attempt,
    });
    return {
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully',
    };
  } catch (error) {
    logger.error('Failed to send email', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      attempt,
      error: error.message,
    });

    if (attempt < config.retry.maxAttempts) {
      const delay = config.retry.delayMs * attempt;
      logger.info(`Retrying email send in ${delay}ms`, {
        to: mailOptions.to,
        attempt: attempt + 1,
      });
      await sleep(delay);
      return sendEmailWithRetry(mailOptions, attempt + 1);
    }

    throw new Error(`Failed to send email after ${config.retry.maxAttempts} attempts: ${error.message}`);
  }
}

async function sendEmail(payload) {
  const validation = validateEmailPayload(payload);
  if (!validation.isValid) {
    const error = new Error(validation.errors.join(', '));
    error.status = 400;
    throw error;
  }

  const mailOptions = {
    from: `${config.email.fromName} <${config.email.fromAddress}>`,
    to: payload.to,
    subject: payload.subject,
    text: payload.body,
    html: payload.htmlBody,
    cc: payload.cc,
    bcc: payload.bcc,
    replyTo: payload.replyTo,
  };

  if (payload.attachments && payload.attachments.length > 0) {
    mailOptions.attachments = payload.attachments;
  }

  return sendEmailWithRetry(mailOptions);
}

async function verifySmtpConnection() {
  try {
    await transporter.verify();
    logger.info('SMTP connection verified successfully');
    return true;
  } catch (error) {
    logger.error('SMTP connection verification failed', { error: error.message });
    return false;
  }
}

module.exports = {
  initializeTransporter,
  sendEmail,
  verifySmtpConnection,
};
