# Discord Auto-Role & Ticket Bot

**Author:** Wildflover  
**Version:** 2.0.0  
**Framework:** Discord.js v14

## Project Overview

Professional Discord bot with automated role assignment and advanced ticket support system. Built with modern JavaScript practices, modular architecture, and optimized for Railway.app deployment.

## Features

### Role Management
- Mention-based role assignment trigger
- Automatic green check reaction confirmation
- Timed message deletion (configurable)
- Permission validation

### Ticket System
- Multi-category support (Technical, Payment, Account, Other)
- Private channel creation with permissions
- Staff claim system
- Transcript generation
- Auto-close with configurable delay
- Ticket statistics and logging
- Modal-based ticket creation

### System Features
- Professional logging with color-coded output
- Error handling and graceful shutdown
- Welcome card generator with canvas
- Multi-language tutorial system
- Environment-based configuration

## Architecture

```
discord-bot/
├── src/
│   ├── bot.js                    # Core bot logic and event handlers
│   ├── commands/
│   │   ├── definitions.js        # Slash command definitions
│   │   ├── handlers.js           # Command execution handlers
│   │   ├── register.js           # Command registration system
│   │   └── tutorials.js          # Tutorial embed system
│   ├── ticket/
│   │   ├── ticketConfig.js       # Ticket system configuration
│   │   ├── ticketStorage.js      # JSON database management
│   │   ├── ticketEmbed.js        # Professional embed designs
│   │   ├── ticketButtons.js      # Button components
│   │   ├── ticketModal.js        # Modal forms
│   │   ├── ticketManager.js      # Core ticket management
│   │   └── ticketHandler.js      # Interaction handlers
│   ├── utils/
│   │   ├── logger.js             # Professional logging utility
│   │   └── translations.js       # Multi-language support
│   └── welcome/
│       └── welcomeCard.js        # Welcome card generator
├── data/                         # Ticket database (auto-created)
├── config.json                   # Bot configuration
├── index.js                      # Application entry point
├── TICKET_SYSTEM.md              # Ticket system documentation
└── README.md                     # Main documentation
```

## Commands

### User Commands
- `/ping` - Check bot response time and status
- `/info` - Display bot information and statistics
- `/help` - Show available commands
- `/tutorial <topic> [language]` - Access comprehensive guides

### Admin Commands
- `/config` - View current bot configuration
- `/setwelcome <channel>` - Set welcome message channel
- `/ticket setup` - Create ticket panel in current channel
- `/ticket stats` - View ticket statistics
- `/ticket close` - Force close current ticket

## Ticket System

### Quick Start

1. **Setup Ticket Panel**
   ```
   /ticket setup
   ```
   Run this command in the channel where you want the ticket panel.

2. **User Creates Ticket**
   - Click "Create Ticket" button
   - Select category
   - Fill in the modal form
   - Private channel is created automatically

3. **Staff Management**
   - Claim tickets with "Claim" button
   - Close tickets with "Close Ticket" button
   - Generate transcripts with "Transcript" button

### Ticket Categories

- **Technical Support** - Launcher / Skins not working
- **Payment Issues** - Orders, commissions, subscriptions
- **Account Help** - Login, access, roles
- **Other Concerns** - Not covered elsewhere

For detailed ticket system documentation, see [TICKET_SYSTEM.md](TICKET_SYSTEM.md)

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

### Essential Permissions
- `MANAGE_ROLES` - Assign roles to members
- `MANAGE_CHANNELS` - Create and manage ticket channels
- `ADD_REACTIONS` - Add reactions to messages
- `SEND_MESSAGES` - Send messages in channels
- `EMBED_LINKS` - Send embedded messages
- `ATTACH_FILES` - Send transcripts and welcome cards
- `READ_MESSAGE_HISTORY` - Read channel messages
- `MANAGE_MESSAGES` - Delete messages

### Recommended Role Position
Bot's role should be higher than the role it assigns to prevent hierarchy errors.

## Usage

### Role Assignment
1. User mentions target user in configured channel
2. Bot adds ✅ reaction to message
3. Bot assigns configured role to user
4. Bot sends confirmation message
5. Confirmation auto-deletes after 3.5 seconds

### Ticket System
1. Admin runs `/ticket setup` in desired channel
2. Users click "Create Ticket" button
3. Select category from dropdown
4. Fill modal form with issue details
5. Private channel created automatically
6. Staff receives notification
7. Staff can claim, manage, and close tickets
8. Channel auto-deletes 10 seconds after closing

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
