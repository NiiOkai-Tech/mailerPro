# MailerPro - Quick Start Guide

Get MailerPro running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure SMTP

Copy the example environment file and add your SMTP credentials:

```bash
cp .env.example .env
```

Edit `.env` with your SMTP server details:

```env
# For Gmail:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# For SendGrid:
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.your-sendgrid-api-key

# For AWS SES:
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-username
SMTP_PASS=your-ses-password

# API Configuration
API_KEY=your-very-secret-api-key-here
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
```

### Gmail Setup
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable "2-Step Verification"
3. Create an "App Password"
4. Use that password in `SMTP_PASS`

## Step 3: Start the Server

```bash
npm start
```

You should see:
```
info: Email API Server started {"port":3000,"environment":"development"}
```

## Step 4: Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

### Send an Email

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "X-API-Key: your-very-secret-api-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "Test Email",
    "body": "Hello from MailerPro!",
    "htmlBody": "<h1>Hello</h1><p>This is a test email from MailerPro!</p>"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "success": true,
    "messageId": "<some-id@server>",
    "message": "Email sent successfully"
  }
}
```

## Step 5: Use in Your Application

### Node.js/Express Example

```javascript
const axios = require('axios');

async function sendWelcomeEmail(userEmail) {
  try {
    const response = await axios.post('http://localhost:3000/api/email/send', {
      to: userEmail,
      subject: 'Welcome!',
      htmlBody: '<h1>Welcome</h1><p>Thanks for signing up!</p>',
    }, {
      headers: {
        'X-API-Key': process.env.MAILER_API_KEY,
      },
    });

    console.log('Email sent:', response.data);
  } catch (error) {
    console.error('Failed to send email:', error.response?.data);
  }
}

// Usage
sendWelcomeEmail('newuser@example.com');
```

### Using the Client Library

```javascript
const MailerProClient = require('./examples/client');

const mailer = new MailerProClient(
  'http://localhost:3000',
  'your-very-secret-api-key-here'
);

// Send single email
mailer.sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'Test email',
  htmlBody: '<h1>Hello</h1>',
});

// Send batch
mailer.sendBatch([
  {
    to: 'user1@example.com',
    subject: 'Welcome',
    body: 'Welcome User 1',
  },
  {
    to: 'user2@example.com',
    subject: 'Welcome',
    body: 'Welcome User 2',
  },
]);
```

### Python Example

```python
import requests
import os

def send_email(to_address, subject, body):
    headers = {
        'X-API-Key': os.getenv('MAILER_API_KEY'),
        'Content-Type': 'application/json',
    }

    payload = {
        'to': to_address,
        'subject': subject,
        'body': body,
    }

    response = requests.post(
        'http://localhost:3000/api/email/send',
        json=payload,
        headers=headers
    )

    return response.json()

result = send_email('user@example.com', 'Hello', 'Test email')
print(result)
```

### PHP Example

```php
<?php
function sendEmail($to, $subject, $body) {
    $url = 'http://localhost:3000/api/email/send';
    $apiKey = getenv('MAILER_API_KEY');

    $data = [
        'to' => $to,
        'subject' => $subject,
        'body' => $body,
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
    
    return json_decode($response, true);
}

$result = sendEmail('user@example.com', 'Hello', 'Test email');
print_r($result);
?>
```

## Common Issues

### "SMTP connection verification failed"
- Check your SMTP credentials
- Ensure firewall allows outbound connections to SMTP port
- For Gmail, enable "Less secure app access" or use App Password

### "Invalid API key"
- Make sure `API_KEY` in `.env` matches the header you're sending
- The header is `X-API-Key: your-key-here`

### "Invalid recipient email"
- Double-check email address spelling
- Only valid email addresses are accepted

### Rate Limit (429)
- You've exceeded the rate limit (default: 10 requests/minute)
- Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`
- Wait before retrying

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check `examples/requests.http` for more request examples
- Configure production settings (see README.md deployment section)
- Set up monitoring and alerting
- Review security best practices in README.md

## Need Help?

Check the logs:
```bash
tail -f logs/combined.log
```

Common log locations show:
- Email sending attempts
- Validation errors
- SMTP connection issues
- Rate limiting events

---

Happy emailing! 📧
