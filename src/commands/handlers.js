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
const { handleAuthLoginSetup } = require('../alternative-login/verificationCommand');

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

    // Update channel config
    this.bot.channelConfig.welcomeChannelId = channel.id;
    
    const fs = require('fs');
    const path = require('path');
    const channelConfigPath = path.join(__dirname, '../../channels.json');
    
    try {
      fs.writeFileSync(channelConfigPath, JSON.stringify(this.bot.channelConfig, null, 2));
      
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
      const verifiedRoleId = '1458931524656300042';
      const targetGuildId = '1458924040587837452'; // Wildflover server ID
      const targetTag = 'WILD';
      
      // Fetch all members with force to get fresh data including primary_guild
      await guild.members.fetch({ force: true, withPresences: false });
      
      // Count members with verified role
      const verifiedRole = guild.roles.cache.get(verifiedRoleId);
      const verifiedCount = verifiedRole ? verifiedRole.members.size : 0;
      
      logger.info('CHECKGUILDS-SCAN', `Scanning ${guild.members.cache.size} members for server tag: ${targetTag} (Target Guild: ${targetGuildId})`);
      logger.info('CHECKGUILDS-VERIFIED', `Current verified members: ${verifiedCount}`);
      
      // Track members found for debug logging
      let debugCount = 0;
      
      // Find members who have the target server tag in their primary_guild
      const membersWithTag = guild.members.cache.filter(member => {
        // Check if user has primary_guild data
        if (member.user.primaryGuild) {
          const userTag = member.user.primaryGuild.tag;
          const isDisplaying = member.user.primaryGuild.identityEnabled;
          const tagGuildId = member.user.primaryGuild.identityGuildId;
          
          // Log for debugging (first 3 members with tags)
          if (userTag && debugCount < 3) {
            logger.info('CHECKGUILDS-DEBUG', `User: ${member.user.tag} | Tag: ${userTag} | Guild: ${tagGuildId} | Displaying: ${isDisplaying}`);
            debugCount++;
          }
          
          // Check if user has the target tag, is displaying it, AND it's from the target guild
          return userTag && 
                 userTag.toUpperCase() === targetTag.toUpperCase() && 
                 isDisplaying && 
                 tagGuildId === targetGuildId;
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

      // Find members WITH tag but WITHOUT role (need to add role)
      const membersNeedingRole = membersWithTag.filter(member => 
        !member.roles.cache.has(targetRoleId)
      );

      // Find members WITH role but WITHOUT tag (need to remove role)
      const membersNeedingRemoval = guild.members.cache.filter(member => {
        // Has the role
        if (!member.roles.cache.has(targetRoleId)) return false;
        
        // Check if they have the tag
        if (member.user.primaryGuild) {
          const userTag = member.user.primaryGuild.tag;
          const isDisplaying = member.user.primaryGuild.identityEnabled;
          const tagGuildId = member.user.primaryGuild.identityGuildId;
          
          // If they have the correct tag, keep the role
          if (userTag && 
              userTag.toUpperCase() === targetTag.toUpperCase() && 
              isDisplaying && 
              tagGuildId === targetGuildId) {
            return false;
          }
        }
        
        // They have role but not the tag, remove it
        return true;
      });

      const needsRoleCount = membersNeedingRole.size;
      const needsRemovalCount = membersNeedingRemoval.size;
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

      // Remove role from members who shouldn't have it
      const removedMembers = [];
      for (const [, member] of membersNeedingRemoval) {
        try {
          await member.roles.remove(targetRoleId);
          removedMembers.push(member);
          logger.success('CHECKGUILDS-REMOVE', `Role removed from ${member.user.tag}`);
        } catch (error) {
          logger.error('CHECKGUILDS-ERROR', `Failed to remove role from ${member.user.tag}: ${error.message}`);
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
          { name: 'Newly Assigned', value: `${assignedMembers.length}`, inline: true },
          { name: 'Roles Removed', value: `${removedMembers.length}`, inline: true },
          { name: 'Total Verified Members', value: `${verifiedCount}`, inline: false }
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
            .setColor(0x57F287)
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

      // Send notification for each removed member
      if (removedMembers.length > 0) {
        const notificationChannel = interaction.channel;
        
        for (const member of removedMembers) {
          const notificationEmbed = new EmbedBuilder()
            .setColor(0xED4245)
            .setAuthor({
              name: 'Auto Role Removal',
              iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
            })
            .setDescription(`${member} has been automatically removed from <@&${targetRoleId}> role`)
            .addFields(
              { name: 'User', value: member.user.tag, inline: true },
              { name: 'User ID', value: member.id, inline: true },
              { name: 'Reason', value: 'No longer displaying WILD tag', inline: false }
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

      logger.success('COMMAND-CHECKGUILDS', `Executed by ${interaction.user.tag} | Found: ${totalWithTag} | Assigned: ${assignedMembers.length} | Removed: ${removedMembers.length}`);

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

  async handleDownload(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const version = interaction.options.getString('version');
      const directlyLink = interaction.options.getString('directly');
      const mediafireLink = interaction.options.getString('mediafire');
      const googledriveLink = interaction.options.getString('googledrive');
      const dropboxLink = interaction.options.getString('dropbox');

      // Check if at least one link is provided
      if (!directlyLink && !mediafireLink && !googledriveLink && !dropboxLink) {
        await interaction.editReply({
          content: 'Please provide at least one download link.',
          ephemeral: true
        });
        return;
      }

      // Build download buttons
      const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
      const buttons = [];
      
      if (directlyLink) {
        buttons.push(
          new ButtonBuilder()
            .setLabel('Directly')
            .setStyle(ButtonStyle.Link)
            .setURL(directlyLink)
        );
      }
      
      if (mediafireLink) {
        buttons.push(
          new ButtonBuilder()
            .setLabel('MediaFire')
            .setStyle(ButtonStyle.Link)
            .setURL(mediafireLink)
        );
      }
      
      if (googledriveLink) {
        buttons.push(
          new ButtonBuilder()
            .setLabel('Google Drive')
            .setStyle(ButtonStyle.Link)
            .setURL(googledriveLink)
        );
      }
      
      if (dropboxLink) {
        buttons.push(
          new ButtonBuilder()
            .setLabel('Dropbox')
            .setStyle(ButtonStyle.Link)
            .setURL(dropboxLink)
        );
      }

      const row = new ActionRowBuilder().addComponents(buttons);

      // Create download embed
      const downloadEmbed = new EmbedBuilder()
        .setColor(0xE91E63)
        .setAuthor({
          name: `UPDATE ${version}`,
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setDescription('A new version of Wildflover is now available. Click the buttons below to download and install from your preferred platform.')
        .setImage('https://github.com/wiildflover/wildflover-discord-bot/blob/main/download_banner.png?raw=true&v=' + Date.now())
        .setFooter({ 
          text: 'Wildflover > Windows 10/11',
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setTimestamp();

      // Send to channel
      await interaction.channel.send({ 
        content: '@everyone',
        embeds: [downloadEmbed],
        components: [row]
      });

      // Confirm to admin
      await interaction.editReply({
        content: `Download links for version ${version} have been posted successfully.`,
        ephemeral: true
      });

      logger.success('COMMAND-DOWNLOAD', `Version ${version} posted by ${interaction.user.tag} in ${interaction.channel.name}`);

    } catch (error) {
      logger.error('COMMAND-DOWNLOAD', `Execution failed: ${error.message}`);
      await interaction.editReply({
        content: `An error occurred: ${error.message}`,
        ephemeral: true
      });
    }
  }

  async handleDelete(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    try {
      const amount = interaction.options.getInteger('amount');
      const channel = interaction.channel;
      const executor = interaction.user;

      // Check if bot has permission to manage messages
      if (!channel.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.ManageMessages)) {
        await interaction.reply({
          content: 'I do not have permission to manage messages in this channel.',
          ephemeral: true
        });
        return;
      }

      // Defer reply (ephemeral) to prevent timeout
      await interaction.deferReply({ ephemeral: true });

      // Fetch and delete messages
      const messages = await channel.messages.fetch({ limit: amount });
      const deletedMessages = await channel.bulkDelete(messages, true);

      logger.success('COMMAND-DELETE', `${deletedMessages.size} messages deleted by ${executor.tag} in ${channel.name}`);

      // Delete the deferred reply immediately
      await interaction.deleteReply();

      // Send single confirmation message (visible to everyone)
      const confirmEmbed = new EmbedBuilder()
        .setColor(0x57F287)
        .setAuthor({
          name: 'Bulk Delete Complete',
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setDescription(`Successfully deleted **${deletedMessages.size}** messages`)
        .addFields(
          { name: 'Requested Amount', value: `${amount}`, inline: true },
          { name: 'Actually Deleted', value: `${deletedMessages.size}`, inline: true },
          { name: 'Channel', value: `${channel}`, inline: true }
        )
        .setFooter({ 
          text: `Messages older than 14 days cannot be bulk deleted • Used by ${executor.tag}`,
          iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
        })
        .setTimestamp();

      const confirmMessage = await channel.send({ 
        content: `<@${executor.id}>`,
        embeds: [confirmEmbed] 
      });

      // Delete confirmation message after 3 seconds
      setTimeout(async () => {
        try {
          await confirmMessage.delete();
          logger.info('COMMAND-DELETE', 'Confirmation message auto-deleted after 3 seconds');
        } catch (error) {
          logger.warn('COMMAND-DELETE', `Failed to delete confirmation message: ${error.message}`);
        }
      }, 3000);

    } catch (error) {
      logger.error('COMMAND-DELETE', `Execution failed: ${error.message}`);
      
      let errorMessage = 'An error occurred while deleting messages.';
      
      if (error.code === 50034) {
        errorMessage = 'Cannot delete messages older than 14 days.';
      } else if (error.code === 50013) {
        errorMessage = 'Missing permissions to delete messages.';
      }

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: errorMessage,
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: errorMessage,
          ephemeral: true
        });
      }
    }
  }

  async handleAuthLogin(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      await interaction.reply({ 
        content: 'You need Administrator permission to use this command.', 
        ephemeral: true 
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      await handleAuthLoginSetup(interaction);
      logger.info('COMMAND-AUTHLOGIN', `Setup executed by ${interaction.user.tag} in ${interaction.channel.name}`);
    }
  }
}

module.exports = CommandHandlers;
