const axios = require('axios');

class MailerProClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async sendEmail(options) {
    try {
      const response = await this.client.post('/api/email/send', {
        to: options.to,
        subject: options.subject,
        body: options.body,
        htmlBody: options.htmlBody,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async sendBatch(emails) {
    try {
      const response = await this.client.post('/api/email/send-batch', {
        emails,
      });

      return {
        success: response.status === 200 || response.status === 207,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  async checkHealth() {
    try {
      const response = await this.client.get('/api/email/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }
}

module.exports = MailerProClient;

// Usage example:
// const MailerProClient = require('./client');
// const mailer = new MailerProClient('http://localhost:3000', 'your-api-key');
//
// mailer.sendEmail({
//   to: 'user@example.com',
//   subject: 'Welcome',
//   body: 'Plain text',
//   htmlBody: '<h1>Welcome</h1>',
// }).then(result => console.log(result));
