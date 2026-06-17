const validator = require('email-validator');

function validateEmail(email) {
  return validator.validate(email);
}

function validateEmailArray(emails) {
  if (!Array.isArray(emails)) {
    return false;
  }
  return emails.every(email => validateEmail(email));
}

function validateEmailPayload(payload) {
  const errors = [];

  if (!payload.to) {
    errors.push('Missing required field: to');
  } else if (!validateEmail(payload.to)) {
    errors.push(`Invalid recipient email: ${payload.to}`);
  }

  if (payload.cc && !validateEmailArray(payload.cc)) {
    errors.push('Invalid CC email(s)');
  }

  if (payload.bcc && !validateEmailArray(payload.bcc)) {
    errors.push('Invalid BCC email(s)');
  }

  if (payload.replyTo && !validateEmail(payload.replyTo)) {
    errors.push(`Invalid replyTo email: ${payload.replyTo}`);
  }

  if (!payload.subject || typeof payload.subject !== 'string' || payload.subject.trim() === '') {
    errors.push('Missing or invalid subject');
  }

  if (!payload.body && !payload.htmlBody) {
    errors.push('At least one of body or htmlBody is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateEmail,
  validateEmailArray,
  validateEmailPayload,
};
