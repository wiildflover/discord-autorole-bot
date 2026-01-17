# Railway.app Deployment Guide

**Author:** Wildflover  
**Platform:** Railway.app  
**Estimated Time:** 10 minutes

## Prerequisites

- GitHub account
- Discord bot token
- Discord server with admin permissions

## Step-by-Step Deployment

### 1. Prepare Discord Bot

```
1. Visit Discord Developer Portal
   → https://discord.com/developers/applications

2. Create New Application
   → Name: "Auto-Role Bot"
   → Create

3. Navigate to Bot Section
   → Add Bot
   → Reset Token (save this token)

4. Enable Privileged Gateway Intents
   → SERVER MEMBERS INTENT: ON
   → MESSAGE CONTENT INTENT: ON
   → Save Changes

5. Generate Invite URL
   → OAuth2 → URL Generator
   → Scopes: bot
   → Permissions: Manage Roles, Send Messages, Add Reactions
   → Copy generated URL
   → Open URL and invite bot to your server
```

### 2. Configure Bot Files

```bash
# Update config.json with your IDs
{
  "token": "YOUR_BOT_TOKEN_FROM_STEP_3",
  "clientId": "YOUR_APPLICATION_ID",
  "guildId": "YOUR_SERVER_ID",
  "targetChannelId": "CHANNEL_WHERE_BOT_WATCHES",
  "targetUserId": "USER_ID_TO_WATCH_FOR_MENTIONS",
  "roleId": "ROLE_ID_TO_ASSIGN",
  "roleName": "Verified",
  "deleteMessageDelay": 3500
}
```

### 3. Push to GitHub

```bash
# Initialize git repository
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Discord Auto-Role Bot"

# Create GitHub repository
# Visit github.com → New Repository

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/discord-autorole-bot.git
git branch -M main
git push -u origin main
```

### 4. Deploy on Railway

```
1. Visit Railway.app
   → https://railway.app
   → Sign in with GitHub

2. Create New Project
   → New Project
   → Deploy from GitHub repo
   → Select your repository

3. Configure Environment (Optional)
   → Project Settings
   → Variables
   → Add: NODE_ENV=production

4. Monitor Deployment
   → View Logs tab
   → Wait for "BOT-READY" message
   → Bot is now online 24/7
```

### 5. Verify Deployment

```
1. Check Railway Logs
   → Should see: [BOT-READY] Logged in as YourBot#1234

2. Test in Discord
   → Go to configured channel
   → Mention target user
   → Bot should react with ✅
   → Bot should assign role
   → Bot should send confirmation (auto-deletes)

3. Monitor Performance
   → Railway Dashboard → Metrics
   → Check CPU/Memory usage
   → Review logs for errors
```

## Configuration Tips

### Role Hierarchy
- Bot's role must be ABOVE the role it assigns
- Discord Settings → Roles → Drag bot role higher

### Channel Permissions
- Bot needs "View Channel" permission
- Bot needs "Read Message History" permission

### Troubleshooting

**Bot not responding:**
- Check Railway logs for errors
- Verify bot token is correct
- Ensure intents are enabled

**Permission errors:**
- Check bot role hierarchy
- Verify MANAGE_ROLES permission
- Check channel-specific permissions

**Role not assigned:**
- Verify roleId in config.json
- Check bot has permission to assign that role
- Ensure role exists in server

## Cost Estimation

Railway.app Free Tier:
- $5 monthly credit
- ~500 hours runtime
- Sufficient for 24/7 operation
- No credit card required initially

## Maintenance

### Update Bot
```bash
# Make changes locally
git add .
git commit -m "Update: description"
git push

# Railway auto-deploys on push
```

### Monitor Logs
```
Railway Dashboard → Your Project → Deployments → View Logs
```

### Restart Bot
```
Railway Dashboard → Your Project → Settings → Restart
```

## Security Best Practices

1. Never commit config.json with real tokens
2. Use environment variables for sensitive data
3. Regularly rotate bot token
4. Monitor bot activity logs
5. Limit bot permissions to minimum required

## Support Resources

- Railway Documentation: https://docs.railway.app
- Discord.js Guide: https://discordjs.guide
- Discord Developer Portal: https://discord.com/developers

---

**Deployment Complete** - Your bot is now running 24/7 on Railway.app
