/**
 * File: handlers.js
 * Author: Wildflover
 * Description: Slash command execution handlers
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const TutorialSystem = require('./tutorials');

class CommandHandlers {
  constructor(bot) {
    this.bot = bot;
  }

  async handlePing(interaction) {
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(this.bot.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Pong!')
      .addFields(
        { name: 'Response Time', value: `${latency}ms`, inline: true },
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-PING', `Executed by ${interaction.user.tag}`);
  }

  async handleInfo(interaction) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const guild = interaction.guild;
    let verifiedCount = 0;
    
    if (guild && this.bot.config.roleId) {
      try {
        await guild.members.fetch();
        const role = guild.roles.cache.get(this.bot.config.roleId);
        if (role) {
          verifiedCount = role.members.size;
        }
      } catch (error) {
        logger.warn('COMMAND-INFO', `Failed to fetch verified members: ${error.message}`);
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Wildflover Community Bot')
      .setDescription('*Advanced automation system for Wildflover Skin Manager community*')
      .setThumbnail('https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg')
      .addFields(
        { 
          name: 'Developer', 
          value: '`Wildflover`', 
          inline: true 
        },
        { 
          name: 'Server Members', 
          value: `**${guild ? guild.memberCount : 'N/A'}**`, 
          inline: true 
        },
        { 
          name: 'Verified Members', 
          value: `**${verifiedCount}**`, 
          inline: true 
        },
        { 
          name: 'Active Servers', 
          value: `${this.bot.client.guilds.cache.size}`, 
          inline: true 
        },
        { 
          name: 'Total Users', 
          value: `${this.bot.client.users.cache.size}`, 
          inline: true 
        },
        { 
          name: 'System Uptime', 
          value: `\`${hours}h ${minutes}m ${seconds}s\``, 
          inline: true 
        }
      )
      .addFields({
        name: 'Core Features',
        value: '> Automated role assignment system\n> Welcome & leave card generator\n> Multi-language tutorial system\n> Configurable welcome channels',
        inline: false
      })
      .setImage('https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_splash_login.jpg')
      .setFooter({ text: 'Crafted with passion & caffeine by Wildflover' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-INFO', `Executed by ${interaction.user.tag} | Verified: ${verifiedCount}`);
  }

  async handleConfig(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Bot Configuration')
      .addFields(
        { name: 'Target Channel', value: `<#${this.bot.config.targetChannelId}>`, inline: false },
        { name: 'Target User', value: `<@${this.bot.config.targetUserId}>`, inline: false },
        { name: 'Assigned Role', value: `<@&${this.bot.config.roleId}>`, inline: false },
        { name: 'Message Delete Delay', value: `${this.bot.config.deleteMessageDelay}ms`, inline: false }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-CONFIG', `Executed by ${interaction.user.tag}`);
  }

  async handleHelp(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Available Commands')
      .setDescription('List of all available slash commands')
      .addFields(
        { name: '/ping', value: 'Check bot response time and status', inline: false },
        { name: '/info', value: 'Display bot information and statistics', inline: false },
        { name: '/config', value: 'View current bot configuration (Admin only)', inline: false },
        { name: '/tutorial', value: 'Complete Wildflover Skin Manager guide with screenshots', inline: false },
        { name: '/setwelcome', value: 'Set welcome/leave message channel (Admin only)', inline: false },
        { name: '/help', value: 'Display this help message', inline: false }
      )
      .addFields({
        name: 'Auto-Role System',
        value: `Mention <@${this.bot.config.targetUserId}> in <#${this.bot.config.targetChannelId}> to receive <@&${this.bot.config.roleId}> role automatically.`,
        inline: false
      })
      .setFooter({ text: 'Bot by Wildflover' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-HELP', `Executed by ${interaction.user.tag}`);
  }

  async handleTutorial(interaction) {
    const topic = interaction.options.getString('topic');
    const language = interaction.options.getString('language') || 'en';
    let embed;

    switch (topic) {
      case 'menu':
        embed = TutorialSystem.getMainMenu(language);
        break;
      case 'home':
        embed = TutorialSystem.getHomeTutorial(language);
        break;
      case 'champions':
        embed = TutorialSystem.getChampionsTutorial(language);
        break;
      case 'skinpage':
        embed = TutorialSystem.getSkinPageTutorial(language);
        break;
      case 'chroma':
        embed = TutorialSystem.getChromaTutorial(language);
        break;
      case 'marketplace':
        embed = TutorialSystem.getMarketplaceTutorial(language);
        break;
      case 'filters':
        embed = TutorialSystem.getMarketplaceFilterTutorial(language);
        break;
      case 'history':
        embed = TutorialSystem.getDownloadHistoryTutorial(language);
        break;
      case 'customs':
        embed = TutorialSystem.getCustomsTutorial(language);
        break;
      case 'activate':
        embed = TutorialSystem.getActivationTutorial(language);
        break;
      case 'settings':
        embed = TutorialSystem.getSettingsTutorial(language);
        break;
      case 'troubleshoot':
        embed = TutorialSystem.getTroubleshooting(language);
        break;
      default:
        embed = TutorialSystem.getMainMenu(language);
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-TUTORIAL', `Topic: ${topic} (${language}) by ${interaction.user.tag}`);
  }

  async handleSetWelcome(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const channel = interaction.options.getChannel('channel');

    if (!channel) {
      await interaction.reply({
        content: 'Channel not found. Please provide a valid channel.',
        ephemeral: true
      });
      logger.warn('COMMAND-SETWELCOME', `Invalid channel provided by ${interaction.user.tag}`);
      return;
    }

    if (channel.type !== 0) {
      await interaction.reply({
        content: 'Please select a text channel.',
        ephemeral: true
      });
      logger.warn('COMMAND-SETWELCOME', `Non-text channel selected by ${interaction.user.tag}`);
      return;
    }

    this.bot.config.welcomeChannelId = channel.id;

    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, '../../config.json');
    
    try {
      fs.writeFileSync(configPath, JSON.stringify(this.bot.config, null, 2));
      
      const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle('Welcome Channel Configuration')
        .setDescription('Welcome and leave messages channel has been successfully configured.')
        .addFields(
          { name: 'Channel Name', value: channel.name, inline: true },
          { name: 'Channel ID', value: channel.id, inline: true },
          { name: 'Channel Mention', value: `<#${channel.id}>`, inline: true }
        )
        .setFooter({ text: 'Welcome cards will be sent to this channel' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      logger.success('COMMAND-SETWELCOME', `Welcome channel set to ${channel.name} (${channel.id}) by ${interaction.user.tag}`);
    } catch (error) {
      logger.error('COMMAND-SETWELCOME', `Failed to save configuration: ${error.message}`);
      await interaction.reply({
        content: 'Failed to save configuration. Please try again.',
        ephemeral: true
      });
    }
  }
}

module.exports = CommandHandlers;
