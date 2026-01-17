# Discord Auto-Role Bot

**Author:** Wildflover  
**Version:** 1.0.0  
**Framework:** Discord.js v14

## Project Overview

Professional Discord bot designed for automated role assignment with reaction-based confirmation system. Built with modern JavaScript practices and optimized for Railway.app deployment.

## Features

- ✓ Mention-based role assignment trigger
- ✓ Automatic green check reaction confirmation
- ✓ Timed message deletion (configurable)
- ✓ Professional logging system with color-coded output
- ✓ Error handling and graceful shutdown
- ✓ Permission validation
- ✓ Environment-based configuration

## Architecture

```
discord-bot/
├── src/
│   ├── bot.js              # Core bot logic and event handlers
│   └── utils/
│       └── logger.js       # Professional logging utility
├── config.json             # Bot configuration (not tracked)
├── index.js                # Application entry point
├── package.json            # Dependencies and scripts
├── railway.json            # Railway deployment configuration
├── .env.example            # Environment variables template
└── README.md               # Documentation
```

## Installation

### Local Development

```bash
# Install dependencies
npm install

# Configure bot
cp .env.example .env
cp config.json.example config.json

# Edit configuration files with your credentials
# Start bot
npm start
```

### Railway.app Deployment

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Environment Variables**
   - Go to project settings
   - Add variables from `.env.example`

4. **Configure Bot Settings**
   - Update `config.json` with your Discord IDs
   - Commit and push changes

5. **Deploy**
   - Railway automatically deploys on push
   - Monitor logs in Railway dashboard

## Configuration

### config.json

```json
{
  "token": "YOUR_BOT_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  "guildId": "YOUR_GUILD_ID",
  "targetChannelId": "CHANNEL_ID",
  "targetUserId": "USER_ID_TO_WATCH",
  "roleId": "ROLE_ID_TO_ASSIGN",
  "roleName": "Verified",
  "deleteMessageDelay": 3500
}
```

### Getting Discord IDs

1. **Enable Developer Mode**
   - Discord Settings → Advanced → Developer Mode

2. **Get IDs**
   - Right-click on user/channel/role → Copy ID

3. **Bot Token**
   - Discord Developer Portal → Applications
   - Select your bot → Bot → Reset Token

## Bot Permissions Required

- `MANAGE_ROLES` - Assign roles to members
- `ADD_REACTIONS` - Add reaction to messages
- `SEND_MESSAGES` - Send confirmation messages
- `READ_MESSAGE_HISTORY` - Read channel messages

## Usage

1. User mentions target user in configured channel
2. Bot adds ✅ reaction to message
3. Bot assigns configured role to mentioned user
4. Bot sends confirmation message mentioning author
5. Confirmation message auto-deletes after 3.5 seconds

## Logging System

Professional color-coded logging with timestamps:

- `[INFO]` - General information (Cyan)
- `[SUCCESS]` - Successful operations (Green)
- `[WARN]` - Warnings (Yellow)
- `[ERROR]` - Errors (Red)
- `[DEBUG]` - Debug information (Magenta)

## Error Handling

- Automatic reconnection on connection loss
- Graceful shutdown on SIGINT/SIGTERM
- Permission validation before operations
- Comprehensive error logging

## Support

For issues or questions, contact Wildflover.

## License

MIT License - See LICENSE file for details
