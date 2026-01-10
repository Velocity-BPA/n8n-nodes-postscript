# n8n-nodes-postscript

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Postscript, an SMS marketing platform built specifically for e-commerce. This node enables workflow automation for subscriber management, SMS/MMS campaigns, automations, event tracking, and more.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Features

- **Subscriber Management**: Create, update, tag, and manage SMS subscribers with E.164 phone number formatting
- **SMS & MMS Messaging**: Send text and multimedia messages with delivery tracking
- **Campaign Management**: Schedule and monitor SMS marketing campaigns
- **Automation Control**: Trigger, enable, and disable automated workflows
- **Event Tracking**: Send custom and e-commerce events for automation triggers
- **Segment Management**: Create and manage subscriber segments
- **Keyword Management**: Configure opt-in keywords and auto-responses
- **Webhook Support**: Receive real-time notifications for subscriber and message events
- **TCPA Compliance**: Built-in awareness of SMS marketing compliance requirements

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter: `n8n-nodes-postscript`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the package
npm install n8n-nodes-postscript

# Restart n8n
n8n start
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-postscript

# Install dependencies
npm install

# Build the project
npm run build

# Create symlink to n8n custom nodes directory
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-postscript

# Restart n8n
n8n start
```

## Credentials Setup

| Field | Type | Description |
|-------|------|-------------|
| API Key | Password | Your Postscript API key from Shop Settings → API |
| Environment | Options | Production or Sandbox environment |

### Obtaining API Credentials

1. Log in to your Postscript dashboard
2. Navigate to **Shop Settings** → **API**
3. Create a new API key
4. Copy the API key and add it to n8n credentials

## Resources & Operations

### Subscriber

| Operation | Description |
|-----------|-------------|
| Get All | List all subscribers with optional filters |
| Get | Retrieve a subscriber by ID |
| Get By Phone | Find a subscriber by phone number |
| Create | Add a new subscriber (requires keyword opt-in) |
| Update | Update subscriber details |
| Unsubscribe | Opt out a subscriber |
| Add Tag | Add a tag to a subscriber |
| Remove Tag | Remove a tag from a subscriber |
| Update Properties | Update custom subscriber properties |

### Message

| Operation | Description |
|-----------|-------------|
| Get All | List all sent messages |
| Get | Retrieve a message by ID |
| Send | Send an SMS message |
| Send MMS | Send a multimedia message |
| Get Stats | Get delivery statistics |

### Keyword

| Operation | Description |
|-----------|-------------|
| Get All | List all keywords |
| Get | Retrieve a keyword by ID |
| Create | Create a new opt-in keyword |
| Update | Update keyword settings |
| Delete | Remove a keyword |

### Campaign

| Operation | Description |
|-----------|-------------|
| Get All | List all campaigns |
| Get | Retrieve a campaign by ID |
| Get Stats | Get campaign analytics |
| Schedule | Schedule a campaign for sending |

### Automation

| Operation | Description |
|-----------|-------------|
| Get All | List all automations |
| Get | Retrieve an automation by ID |
| Get Stats | Get automation performance data |
| Trigger | Manually trigger for a subscriber |
| Enable | Enable an automation |
| Disable | Disable an automation |

### Segment

| Operation | Description |
|-----------|-------------|
| Get All | List all segments |
| Get | Retrieve a segment by ID |
| Create | Create a new segment |
| Get Subscribers | List subscribers in a segment |
| Get Count | Get the number of subscribers in a segment |

### Event

| Operation | Description |
|-----------|-------------|
| Track | Send a custom event |
| Track E-commerce | Send purchase/cart events |
| Get Types | List available event types |

### Shop

| Operation | Description |
|-----------|-------------|
| Get | Get shop details |
| Get Stats | Get overall statistics |
| Get Compliance Settings | Get TCPA compliance settings |

### Webhook

| Operation | Description |
|-----------|-------------|
| Get All | List all webhooks |
| Create | Register a new webhook |
| Update | Modify webhook settings |
| Delete | Remove a webhook |

## Trigger Node

The **Postscript Trigger** node receives real-time webhook events:

| Event | Description |
|-------|-------------|
| subscriber.subscribed | New subscriber opted in |
| subscriber.unsubscribed | Subscriber opted out |
| message.sent | Message was sent |
| message.delivered | Message was delivered |
| message.failed | Message delivery failed |
| message.clicked | Link in message was clicked |
| message.replied | Subscriber replied to message |

## Usage Examples

### Create a New Subscriber

```javascript
// Node: Postscript
// Operation: Create Subscriber
{
  "phone_number": "555-123-4567",  // Automatically formatted to E.164
  "keyword_id": "kw_abc123",        // Required for TCPA compliance
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com"
}
```

### Send an SMS Message

```javascript
// Node: Postscript
// Operation: Send Message
{
  "subscriber_id": "sub_xyz789",
  "body": "Thanks for your order! Use code SAVE10 for 10% off.",
  "keyword_id": "kw_abc123"
}
```

### Track an E-commerce Event

```javascript
// Node: Postscript
// Operation: Track E-commerce Event
{
  "phone_number": "+15551234567",
  "event_type": "checkout_completed",
  "properties": {
    "order_id": "12345",
    "total": 99.99,
    "currency": "USD"
  }
}
```

## SMS Marketing Concepts

### E.164 Phone Number Format

All phone numbers must be in E.164 format: `+1XXXXXXXXXX`

The node automatically formats common input formats:
- `555-123-4567` → `+15551234567`
- `(555) 123-4567` → `+15551234567`
- `15551234567` → `+15551234567`

### TCPA Compliance

Postscript enforces TCPA (Telephone Consumer Protection Act) compliance:

- **Keyword Opt-in**: Subscribers must opt in via a keyword
- **Quiet Hours**: Messages respect 9pm-9am local time
- **Shop Name Prefix**: Your shop name is automatically added to messages
- **STOP Keyword**: Unsubscribe is handled automatically

### Message Limits

| Type | Character Limit |
|------|-----------------|
| SMS | 160 characters |
| MMS | 1,600 characters |

## Error Handling

The node handles common API errors:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad request - Check input parameters |
| 401 | Unauthorized - Verify API key |
| 403 | Forbidden - Check API permissions |
| 404 | Not found - Resource doesn't exist |
| 422 | Validation error - Check data format |
| 429 | Rate limited - Too many requests |

## Security Best Practices

1. **Store API keys securely** - Use n8n's credential management
2. **Use environment-specific keys** - Separate production/sandbox
3. **Monitor rate limits** - Postscript allows 100 requests/minute
4. **Validate phone numbers** - Ensure E.164 format before sending
5. **Review webhook signatures** - Verify webhook authenticity

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-postscript/issues)
- **Documentation**: [Postscript API Docs](https://developers.postscript.io/)
- **Licensing**: licensing@velobpa.com

## Acknowledgments

- [Postscript](https://postscript.io/) for their excellent SMS marketing platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for their contributions and feedback
