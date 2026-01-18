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
const CommandRegistry = require('./commands/register');
const CommandHandlers = require('./commands/handlers');
const commandDefinitions = require('./commands/definitions');
const WelcomeCardGenerator = require('./welcome/welcomeCard');

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
    this.commandHandlers = new CommandHandlers(this);
    this.initialize();
  }

  initialize() {
    this.client.once(Events.ClientReady, () => this.onReady());
    this.client.on(Events.MessageCreate, (message) => this.onMessageCreate(message));
    this.client.on(Events.InteractionCreate, (interaction) => this.onInteractionCreate(interaction));
    this.client.on(Events.GuildMemberAdd, (member) => this.onMemberJoin(member));
    this.client.on(Events.GuildMemberRemove, (member) => this.onMemberLeave(member));
    this.client.on(Events.Error, (error) => logger.error('CLIENT-ERROR', error));
  }

  async onReady() {
    logger.success('BOT-READY', `Logged in as ${this.client.user.tag}`);
    logger.info('BOT-STATUS', `Monitoring channel: ${this.config.targetChannelId}`);
    logger.info('BOT-STATUS', `Target user: ${this.config.targetUserId}`);
    
    this.client.user.setPresence({
      activities: [],
      status: 'online'
    });
    
    logger.info('BOT-PRESENCE', 'Presence cleared - no activity shown');

    await this.registerSlashCommands();
  }

  async registerSlashCommands() {
    try {
      const registry = new CommandRegistry(this.config.token, this.config.clientId);
      
      registry.addCommand(commandDefinitions.ping);
      registry.addCommand(commandDefinitions.info);
      registry.addCommand(commandDefinitions.config);
      registry.addCommand(commandDefinitions.tutorial);
      registry.addCommand(commandDefinitions.help);
      registry.addCommand(commandDefinitions.setwelcome);

      await registry.registerGlobally();
    } catch (error) {
      logger.error('COMMAND-SETUP', `Failed to register slash commands: ${error.message}`);
    }
  }

  async onInteractionCreate(interaction) {
    if (!interaction.isChatInputCommand()) return;

    try {
      logger.info('COMMAND-RECEIVED', `/${interaction.commandName} by ${interaction.user.tag}`);

      switch (interaction.commandName) {
        case 'ping':
          await this.commandHandlers.handlePing(interaction);
          break;
        case 'info':
          await this.commandHandlers.handleInfo(interaction);
          break;
        case 'config':
          await this.commandHandlers.handleConfig(interaction);
          break;
        case 'tutorial':
          await this.commandHandlers.handleTutorial(interaction);
          break;
        case 'help':
          await this.commandHandlers.handleHelp(interaction);
          break;
        case 'setwelcome':
          await this.commandHandlers.handleSetWelcome(interaction);
          break;
        default:
          await interaction.reply({ content: 'Unknown command.', ephemeral: true });
      }
    } catch (error) {
      logger.error('COMMAND-ERROR', `Error executing ${interaction.commandName}: ${error.message}`);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
      }
    }
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
    
    // Role will be given to the message AUTHOR, not the mentioned user
    logger.info('ROLE-PROCESS', `Fetching member: ${message.author.id} (message author)`);
    const member = await guild.members.fetch(message.author.id);
    
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

      logger.info('ROLE-ADDING', `Attempting to add role ${role.name} to ${message.author.tag} (message author)`);
      
      if (member.roles.cache.has(role.id)) {
        logger.warn('ROLE-EXISTS', `User already has role ${role.name}`);
        
        const responseMessage = await message.reply({
          content: `<@${message.author.id}> You already have <@&${role.id}> role.`,
          allowedMentions: { users: [message.author.id], roles: [] }
        });

        setTimeout(async () => {
          try {
            await responseMessage.delete();
            logger.info('MESSAGE-DELETED', `Warning message deleted after ${this.config.deleteMessageDelay}ms`);
          } catch (error) {
            logger.warn('DELETE-ERROR', 'Failed to delete warning message');
          }
        }, this.config.deleteMessageDelay);
        
        return;
      } else {
        await member.roles.add(role);
        logger.success('ROLE-ASSIGNED', `Role "${role.name}" assigned to ${message.author.tag}`);
      }

      const responseMessage = await message.reply({
        content: `<@${message.author.id}> <@&${role.id}> role has been assigned successfully.`,
        allowedMentions: { users: [message.author.id], roles: [] }
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

  async onMemberJoin(member) {
    try {
      logger.info('MEMBER-JOIN', `${member.user.tag} joined ${member.guild.name}`);

      const welcomeCard = await WelcomeCardGenerator.generateCard(member, 'welcome');
      
      if (!welcomeCard) {
        logger.warn('MEMBER-JOIN', 'Failed to generate welcome card');
        return;
      }

      const embed = WelcomeCardGenerator.createEmbed(member, 'welcome');

      let targetChannel = null;
      
      if (this.config.welcomeChannelId) {
        targetChannel = member.guild.channels.cache.get(this.config.welcomeChannelId);
        if (!targetChannel) {
          logger.warn('MEMBER-JOIN', `Configured welcome channel ${this.config.welcomeChannelId} not found, falling back to system channel`);
        }
      }
      
      if (!targetChannel) {
        targetChannel = member.guild.systemChannel;
      }

      if (targetChannel) {
        await targetChannel.send({
          embeds: [embed],
          files: [welcomeCard]
        });
        logger.success('MEMBER-JOIN', `Welcome card sent for ${member.user.tag} to ${targetChannel.name}`);
      } else {
        logger.warn('MEMBER-JOIN', 'No channel found for welcome message');
      }
    } catch (error) {
      logger.error('MEMBER-JOIN', `Error handling member join: ${error.message}`);
    }
  }

  async onMemberLeave(member) {
    try {
      logger.info('MEMBER-LEAVE', `${member.user.tag} left ${member.guild.name}`);

      const leaveCard = await WelcomeCardGenerator.generateCard(member, 'leave');
      
      if (!leaveCard) {
        logger.warn('MEMBER-LEAVE', 'Failed to generate leave card');
        return;
      }

      const embed = WelcomeCardGenerator.createEmbed(member, 'leave');

      let targetChannel = null;
      
      if (this.config.welcomeChannelId) {
        targetChannel = member.guild.channels.cache.get(this.config.welcomeChannelId);
        if (!targetChannel) {
          logger.warn('MEMBER-LEAVE', `Configured welcome channel ${this.config.welcomeChannelId} not found, falling back to system channel`);
        }
      }
      
      if (!targetChannel) {
        targetChannel = member.guild.systemChannel;
      }

      if (targetChannel) {
        await targetChannel.send({
          embeds: [embed],
          files: [leaveCard]
        });
        logger.success('MEMBER-LEAVE', `Leave card sent for ${member.user.tag} to ${targetChannel.name}`);
      } else {
        logger.warn('MEMBER-LEAVE', 'No channel found for leave message');
      }
    } catch (error) {
      logger.error('MEMBER-LEAVE', `Error handling member leave: ${error.message}`);
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
