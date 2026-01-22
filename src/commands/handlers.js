/**
 * File: handlers.js
 * Author: Wildflover
 * Description: Slash command execution handlers
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const TutorialSystem = require('./tutorials');
const TicketManager = require('../ticket/ticketManager');
const VerifiedManager = require('../verified/verifiedManager');
const HowToVerifiedManager = require('../verified/howToVerifiedManager');
const RulesManager = require('../rules/rulesManager');

class CommandHandlers {
  constructor(bot) {
    this.bot = bot;
    this.ticketManager = new TicketManager(bot.client);
    this.verifiedManager = new VerifiedManager(bot.client, bot.config);
    this.howToVerifiedManager = new HowToVerifiedManager(bot.client);
    this.rulesManager = new RulesManager(bot.client);
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
          value: 'Wildflover', 
          inline: true 
        },
        { 
          name: 'Server Members', 
          value: `${guild ? guild.memberCount : 'N/A'}`, 
          inline: true 
        },
        { 
          name: 'Verified Members', 
          value: `${verifiedCount}`, 
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
          value: `${hours}h ${minutes}m ${seconds}s`, 
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

  async handleTicket(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'setup':
        await this.handleTicketSetup(interaction);
        break;
      case 'stats':
        await this.handleTicketStats(interaction);
        break;
      case 'close':
        await this.handleTicketForceClose(interaction);
        break;
      default:
        await interaction.reply({ content: 'Unknown subcommand.', ephemeral: true });
    }
  }

  async handleTicketSetup(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const result = await this.ticketManager.setupTicketPanel(interaction.channel);

    if (result.success) {
      await interaction.editReply({
        content: 'Ticket panel has been successfully created in this channel.',
        ephemeral: true
      });
      logger.success('COMMAND-TICKET', `Panel setup by ${interaction.user.tag} in ${interaction.channel.name}`);
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleTicketStats(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const stats = await this.ticketManager.getTicketStats(interaction.guild);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Ticket System Statistics')
      .addFields(
        { name: 'Total Tickets', value: `${stats.total}`, inline: true },
        { name: 'Open Tickets', value: `${stats.open}`, inline: true },
        { name: 'Pending Tickets', value: `${stats.pending}`, inline: true },
        { name: 'Closed Tickets', value: `${stats.closed}`, inline: true }
      )
      .setFooter({ text: 'Ticket System by Wildflover' })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed], ephemeral: true });
    logger.info('COMMAND-TICKET', `Stats viewed by ${interaction.user.tag}`);
  }

  async handleTicketForceClose(interaction) {
    const channelName = interaction.channel.name;
    
    if (!channelName.includes('tech-support') && 
        !channelName.includes('payment') && 
        !channelName.includes('account') && 
        !channelName.includes('other')) {
      await interaction.reply({
        content: 'This command can only be used in ticket channels.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const result = await this.ticketManager.closeTicket(interaction.channel, interaction.user, 'Force closed by administrator');

    if (result.success) {
      logger.info('COMMAND-TICKET', `Force closed by ${interaction.user.tag}`);
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleVerified(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      await this.verifiedManager.setupVerificationPanel(interaction);
      logger.info('COMMAND-VERIFIED', `Setup executed by ${interaction.user.tag} in ${interaction.channel.name}`);
    }
  }

  async handleHowToVerified(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      await this.howToVerifiedManager.setupGuidePanel(interaction);
      logger.info('COMMAND-HOWTOVERIFIED', `Guide setup executed by ${interaction.user.tag} in ${interaction.channel.name}`);
    }
  }

  async handleCheckGuilds(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = interaction.guild;
      const targetRoleId = '1463770776900468941';
      const targetTag = 'WILD';
      
      // Fetch all members with force to get fresh data including primary_guild
      await guild.members.fetch({ force: true, withPresences: false });
      
      logger.info('CHECKGUILDS-SCAN', `Scanning ${guild.members.cache.size} members for server tag: ${targetTag}`);
      
      // Track members found for debug logging
      let debugCount = 0;
      
      // Find members who have the target server tag in their primary_guild
      const membersWithTag = guild.members.cache.filter(member => {
        // Check if user has primary_guild data
        if (member.user.primaryGuild) {
          const userTag = member.user.primaryGuild.tag;
          const isDisplaying = member.user.primaryGuild.identityEnabled;
          
          // Log for debugging (first 3 members with tags)
          if (userTag && debugCount < 3) {
            logger.info('CHECKGUILDS-DEBUG', `User: ${member.user.tag} | Tag: ${userTag} | Displaying: ${isDisplaying}`);
            debugCount++;
          }
          
          // Check if user has the target tag and is displaying it
          return userTag && userTag.toUpperCase() === targetTag.toUpperCase() && isDisplaying;
        }
        return false;
      });

      logger.info('CHECKGUILDS-RESULT', `Found ${membersWithTag.size} members with ${targetTag} server tag`);

      const totalWithTag = membersWithTag.size;
      const targetRole = guild.roles.cache.get(targetRoleId);
      
      if (!targetRole) {
        await interaction.editReply({
          content: 'Target role not found. Please check the role ID.',
          ephemeral: true
        });
        return;
      }

      // Find members without the role
      const membersNeedingRole = membersWithTag.filter(member => 
        !member.roles.cache.has(targetRoleId)
      );

      const needsRoleCount = membersNeedingRole.size;
      const alreadyHasRole = totalWithTag - needsRoleCount;

      // Assign role to members who don't have it
      const assignedMembers = [];
      for (const [, member] of membersNeedingRole) {
        try {
          await member.roles.add(targetRoleId);
          assignedMembers.push(member);
          logger.success('CHECKGUILDS-ASSIGN', `Role assigned to ${member.user.tag}`);
        } catch (error) {
          logger.error('CHECKGUILDS-ERROR', `Failed to assign role to ${member.user.tag}: ${error.message}`);
        }
      }

      // Create summary embed
      const summaryEmbed = new EmbedBuilder()
        .setColor(0x57F287)
        .setAuthor({
          name: 'Server Tag Scan Complete',
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setImage('https://github.com/wiildflover/wildflover-discord-bot/blob/main/banner.png?raw=true')
        .setDescription(`Scanned server for members displaying **${targetTag}** server tag`)
        .addFields(
          { name: 'Total with Tag', value: `${totalWithTag}`, inline: true },
          { name: 'Already Had Role', value: `${alreadyHasRole}`, inline: true },
          { name: 'Newly Assigned', value: `${assignedMembers.length}`, inline: true }
        )
        .setFooter({ 
          text: 'Server Tag Detection System',
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [summaryEmbed], ephemeral: true });

      // Send notification for each assigned member
      if (assignedMembers.length > 0) {
        const notificationChannel = interaction.channel;
        
        for (const member of assignedMembers) {
          const notificationEmbed = new EmbedBuilder()
            .setColor(0xF39C12)
            .setAuthor({
              name: 'Auto Role Assignment',
              iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
            })
            .setDescription(`${member} has been automatically assigned <@&${targetRoleId}> role`)
            .addFields(
              { name: 'User', value: member.user.tag, inline: true },
              { name: 'User ID', value: member.id, inline: true },
              { name: 'Server Tag', value: targetTag, inline: true }
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ 
              text: 'Automated by CheckGuilds Command',
              iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
            })
            .setTimestamp();

          await notificationChannel.send({ 
            content: `<@${interaction.user.id}>`,
            embeds: [notificationEmbed] 
          });
        }
      }

      logger.success('COMMAND-CHECKGUILDS', `Executed by ${interaction.user.tag} | Found: ${totalWithTag} | Assigned: ${assignedMembers.length}`);

    } catch (error) {
      logger.error('COMMAND-CHECKGUILDS', `Execution failed: ${error.message}`);
      await interaction.editReply({
        content: `An error occurred: ${error.message}`,
        ephemeral: true
      });
    }
  }

  async handleServerRules(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      await this.rulesManager.setupRulesPanel(interaction);
      logger.info('COMMAND-SERVERRULES', `Setup executed by ${interaction.user.tag} in ${interaction.channel.name}`);
    }
  }
}

module.exports = CommandHandlers;
