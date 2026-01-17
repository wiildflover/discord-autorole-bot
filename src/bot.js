/**
 * File: bot.js
 * Author: Wildflover
 * Description: Advanced Discord bot with automated role assignment and reaction system
 * Language: JavaScript (Node.js)
 * Framework: Discord.js v14
 */

const { Client, GatewayIntentBits, Events, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

// Load configuration with fallback to environment variables
let config;
const configPath = path.join(__dirname, '../config.json');

if (fs.existsSync(configPath)) {
  config = require('../config.json');
} else {
  config = {
    token: process.env.DISCORD_TOKEN,
    clientId: process.env.CLIENT_ID,
    targetChannelId: process.env.TARGET_CHANNEL_ID,
    targetUserId: process.env.TARGET_USER_ID,
    roleId: process.env.ROLE_ID,
    roleName: process.env.ROLE_NAME || 'Verified',
    deleteMessageDelay: parseInt(process.env.DELETE_MESSAGE_DELAY) || 3500
  };
}

class AutoRoleBot {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
      ]
    });

    this.config = config;
    this.initialize();
  }

  initialize() {
    this.client.once(Events.ClientReady, () => this.onReady());
    this.client.on(Events.MessageCreate, (message) => this.onMessageCreate(message));
    this.client.on(Events.Error, (error) => logger.error('CLIENT-ERROR', error));
  }

  onReady() {
    logger.success('BOT-READY', `Logged in as ${this.client.user.tag}`);
    logger.info('BOT-STATUS', `Monitoring channel: ${this.config.targetChannelId}`);
    logger.info('BOT-STATUS', `Target user: ${this.config.targetUserId}`);
    
    this.client.user.setPresence({
      activities: [{ 
        name: 'Wildflover',
        type: 0
      }],
      status: 'online'
    });
    
    logger.info('BOT-PRESENCE', 'Custom presence set: Playing Wildflover');
  }

  async onMessageCreate(message) {
    try {
      logger.info('MESSAGE-RECEIVED', `Message from ${message.author.tag} in channel ${message.channel.id}`);
      
      if (message.author.bot) {
        logger.info('MESSAGE-SKIP', 'Message from bot, skipping');
        return;
      }
      
      if (message.channel.id !== this.config.targetChannelId) {
        logger.info('MESSAGE-SKIP', `Wrong channel: ${message.channel.id} (expected: ${this.config.targetChannelId})`);
        return;
      }

      const mentionedUser = message.mentions.users.first();
      logger.info('MENTION-CHECK', `Mentioned user: ${mentionedUser ? mentionedUser.id : 'none'} (expected: ${this.config.targetUserId})`);
      
      if (!mentionedUser || mentionedUser.id !== this.config.targetUserId) {
        logger.info('MESSAGE-SKIP', 'Target user not mentioned');
        return;
      }

      logger.success('TRIGGER-DETECTED', 'All conditions met, processing role assignment');
      await this.processRoleAssignment(message, mentionedUser);
    } catch (error) {
      logger.error('MESSAGE-HANDLER', error.message);
    }
  }

  async processRoleAssignment(message, mentionedUser) {
    const guild = message.guild;
    
    logger.info('ROLE-PROCESS', `Fetching member: ${mentionedUser.id}`);
    const member = await guild.members.fetch(mentionedUser.id);
    
    logger.info('ROLE-PROCESS', `Fetching role: ${this.config.roleId}`);
    const role = guild.roles.cache.get(this.config.roleId);

    if (!role) {
      logger.error('ROLE-ERROR', `Role not found: ${this.config.roleId}`);
      logger.error('ROLE-ERROR', `Available roles: ${guild.roles.cache.map(r => `${r.name}(${r.id})`).join(', ')}`);
      return;
    }

    logger.info('ROLE-FOUND', `Role found: ${role.name} (${role.id})`);

    if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      logger.error('PERMISSION-ERROR', 'Bot lacks MANAGE_ROLES permission');
      return;
    }

    const botRole = guild.members.me.roles.highest;
    logger.info('ROLE-HIERARCHY', `Bot highest role: ${botRole.name} (position: ${botRole.position})`);
    logger.info('ROLE-HIERARCHY', `Target role: ${role.name} (position: ${role.position})`);

    if (botRole.position <= role.position) {
      logger.error('HIERARCHY-ERROR', `Bot role position (${botRole.position}) must be higher than target role (${role.position})`);
      return;
    }

    try {
      await message.react('✅');
      logger.info('REACTION-ADDED', `Green check added to message ${message.id}`);

      logger.info('ROLE-ADDING', `Attempting to add role ${role.name} to ${mentionedUser.tag}`);
      
      if (member.roles.cache.has(role.id)) {
        logger.warn('ROLE-EXISTS', `User already has role ${role.name}`);
      } else {
        await member.roles.add(role);
        logger.success('ROLE-ASSIGNED', `Role "${role.name}" assigned to ${mentionedUser.tag}`);
      }

      const responseMessage = await message.reply({
        content: `<@${message.author.id}> **${this.config.roleName}** role has been assigned successfully.`,
        allowedMentions: { users: [message.author.id] }
      });

      setTimeout(async () => {
        try {
          await responseMessage.delete();
          logger.info('MESSAGE-DELETED', `Response message deleted after ${this.config.deleteMessageDelay}ms`);
        } catch (error) {
          logger.warn('DELETE-ERROR', 'Failed to delete response message');
        }
      }, this.config.deleteMessageDelay);

    } catch (error) {
      logger.error('PROCESS-ERROR', `Error: ${error.message}`);
      logger.error('PROCESS-ERROR', `Stack: ${error.stack}`);
    }
  }

  start() {
    this.client.login(this.config.token).catch((error) => {
      logger.error('LOGIN-ERROR', 'Failed to authenticate with Discord API');
      process.exit(1);
    });
  }
}

module.exports = AutoRoleBot;
