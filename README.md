# MailerPro - Standalone Email API

A production-ready Node.js API for sending emails via a pre-configured SMTP server. Built with security, reliability, and ease of use in mind.

## Features

- ✅ **SMTP Integration** – Support for any SMTP server (Gmail, SendGrid, AWS SES, etc.)
- ✅ **Email Validation** – Validates all email addresses before sending
- ✅ **Rate Limiting** – Prevent abuse with configurable request limits
- ✅ **Retry Logic** – Automatic exponential backoff for failed emails
- ✅ **Authentication** – API key-based authentication
- ✅ **Logging** – Comprehensive audit trail with Winston logger
- ✅ **Batch Sending** – Send multiple emails in one request
- ✅ **Rich Email Content** – Support for HTML, plain text, attachments
- ✅ **CC/BCC Support** – Full email recipient management

## Installation

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup

1. **Clone or download** the project
2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. **Configure your SMTP credentials:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   API_KEY=your-secure-api-key-here
   EMAIL_FROM_ADDRESS=noreply@example.com
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SMTP_HOST` | - | SMTP server hostname |
| `SMTP_PORT` | 587 | SMTP server port |
| `SMTP_SECURE` | false | Use TLS (true/false) |
| `SMTP_USER` | - | SMTP authentication username |
| `SMTP_PASS` | - | SMTP authentication password |
| `API_PORT` | 3000 | Server listening port |
| `API_KEY` | - | API key for authentication |
| `EMAIL_FROM_NAME` | MailerPro | Display name in From field |
| `EMAIL_FROM_ADDRESS` | - | From email address |
| `RATE_LIMIT_WINDOW_MS` | 60000 | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | 10 | Max requests per window |
| `MAX_RETRY_ATTEMPTS` | 3 | Email send retry attempts |
| `RETRY_DELAY_MS` | 1000 | Initial retry delay (ms) |
| `NODE_ENV` | development | Environment (development/production) |

## API Endpoints

### Health Check
```
GET /health
```
**No authentication required**

Response:
```json
{
  "success": true,
  "message": "Email API is running",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Send Single Email
```
POST /api/email/send
```

**Headers:**
```
X-API-Key: your-secure-api-key-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Welcome!",
  "body": "Plain text version of email",
  "htmlBody": "<h1>Welcome!</h1><p>HTML version of email</p>",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "replyTo": "reply@example.com",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "Buffer or base64 string",
      "encoding": "base64"
    }
  ]
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "success": true,
    "messageId": "<unique-message-id@mail.server>",
    "message": "Email sent successfully"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid recipient email: invalid-email"
}
```

### Send Batch Emails
```
POST /api/email/send-batch
```

**Headers:**
```
X-API-Key: your-secure-api-key-here
Content-Type: application/json
```

**Request Body:**
```json
{
  "emails": [
    {
      "to": "user1@example.com",
      "subject": "Hello User 1",
      "body": "Message for user 1",
      "htmlBody": "<p>Message for user 1</p>"
    },
    {
      "to": "user2@example.com",
      "subject": "Hello User 2",
      "body": "Message for user 2",
      "htmlBody": "<p>Message for user 2</p>"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "2 of 2 emails sent successfully",
  "data": {
    "success": 2,
    "failed": 0,
    "errors": []
  }
}
```

## Usage Examples

### cURL

**Single Email:**
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "X-API-Key: your-secure-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "body": "This is a test email",
    "htmlBody": "<h1>Test</h1><p>This is a test email</p>"
  }'
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function sendEmail() {
  try {
    const response = await axios.post('http://localhost:3000/api/email/send', {
      to: 'user@example.com',
      subject: 'Welcome',
      body: 'Plain text content',
      htmlBody: '<h1>Welcome!</h1>',
    }, {
      headers: {
        'X-API-Key': 'your-secure-api-key-here',
      },
    });

    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

sendEmail();
```

### Python

```python
import requests

def send_email():
    headers = {
        'X-API-Key': 'your-secure-api-key-here',
        'Content-Type': 'application/json',
    }

    payload = {
        'to': 'user@example.com',
        'subject': 'Welcome',
        'body': 'Plain text content',
        'htmlBody': '<h1>Welcome!</h1>',
    }

    response = requests.post(
        'http://localhost:3000/api/email/send',
        json=payload,
        headers=headers
    )

    print(response.json())

send_email()
```

### PHP

```php
<?php
$url = 'http://localhost:3000/api/email/send';
$apiKey = 'your-secure-api-key-here';

$data = [
    'to' => 'user@example.com',
    'subject' => 'Welcome',
    'body' => 'Plain text content',
    'htmlBody' => '<h1>Welcome!</h1>',
];

$options = [
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'X-API-Key: ' . $apiKey,
        ],
        'content' => json_encode($data),
    ],
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

echo $response;
?>
```

## Error Handling

The API returns appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Email(s) sent successfully |
| 207 | Partial success (batch - some failed) |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing API key) |
| 403 | Forbidden (invalid API key) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal server error |

## Logging

Logs are stored in the `logs/` directory:

- **error.log** – Error-level logs only
- **combined.log** – All logs

In development, logs also appear in the console.

## Security Best Practices

1. **API Key Management:**
   - Use a strong, random API key
   - Store it securely (environment variables, secrets manager)
   - Rotate regularly

2. **SMTP Credentials:**
   - Never commit `.env` to version control
   - Use app-specific passwords for Gmail/Office 365
   - Consider using a dedicated email service account

3. **Rate Limiting:**
   - Adjust `RATE_LIMIT_MAX_REQUESTS` based on your needs
   - Monitor logs for suspicious activity

4. **HTTPS in Production:**
   - Always use HTTPS in production
   - Use a reverse proxy (Nginx, Apache, cloud load balancer)

5. **Attachment Handling:**
   - Validate file types and sizes
   - Be cautious with user-uploaded attachments

## Deployment

### Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3000
CMD ["node", "src/index.js"]
```

Build and run:
```bash
docker build -t mailer-pro .
docker run -p 3000:3000 --env-file .env mailer-pro
```

### Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set API_KEY=your-key SMTP_HOST=... SMTP_USER=... SMTP_PASS=...
```

### Systemd (Linux)

Create `/etc/systemd/system/mailer-pro.service`:
```ini
[Unit]
Description=MailerPro Email API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/mailer-pro
ExecStart=/usr/bin/node /opt/mailer-pro/src/index.js
Restart=on-failure
EnvironmentFile=/opt/mailer-pro/.env

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable mailer-pro
sudo systemctl start mailer-pro
```

## Troubleshooting

### SMTP Connection Failed
- Verify SMTP credentials in `.env`
- Check firewall/network access to SMTP server
- Enable "Less secure app access" for Gmail
- Use app-specific password for Gmail/Office 365

### Emails Not Received
- Check logs in `logs/combined.log`
- Verify recipient email address is valid
- Check spam/junk folder
- Verify sender domain reputation

### Rate Limit Issues
- Check `RATE_LIMIT_MAX_REQUESTS` setting
- Implement request queuing on client side
- Consider using batch endpoint for multiple emails

## License

MIT

## Support

For issues or questions, create an issue in the repository or contact the development team.
