/**
 * File: ticketManager.js
 * Author: Wildflover
 * Description: Core ticket management system with channel creation and permission handling
 * Language: JavaScript (Node.js)
 */

const { ChannelType, PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const CONFIG = require('./ticketConfig');
const TicketStorage = require('./ticketStorage');
const TicketEmbed = require('./ticketEmbed');
const TicketButtons = require('./ticketButtons');

class TicketManager {
  constructor(client) {
    this.client = client;
    this.storage = TicketStorage;
  }

  async initialize() {
    await this.storage.initialize();
    logger.success('TICKET-MANAGER', 'Ticket system initialized successfully');
  }

  async createTicket(interaction, category, reason, contactInfo) {
    try {
      const guild = interaction.guild;
      const user = interaction.user;

      const userTickets = await this.storage.getUserTickets(user.id);
      if (userTickets.length >= CONFIG.settings.maxTicketsPerUser) {
        return {
          success: false,
          error: `You already have ${userTickets.length} open tickets. Please close existing tickets before opening new ones.`
        };
      }

      let ticketCategory = guild.channels.cache.find(
        c => c.type === ChannelType.GuildCategory && c.name === CONFIG.settings.categoryChannelName
      );

      if (!ticketCategory) {
        ticketCategory = await guild.channels.create({
          name: CONFIG.settings.categoryChannelName,
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel]
            }
          ]
        });
        logger.info('TICKET-MANAGER', 'Created ticket category channel');
      }

      const categoryData = CONFIG.categories[category];
      const ticketNumber = (await this.storage.getAllTickets()).length + 1;
      const channelName = `${categoryData.channelPrefix}-${ticketNumber}`;

      const ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: ticketCategory.id,
        topic: `Ticket by ${user.tag} | Category: ${categoryData.label}`,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.EmbedLinks
            ]
          },
          {
            id: this.client.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.ManageMessages
            ]
          }
        ]
      });

      const supportRole = guild.roles.cache.find(r => 
        r.name.toLowerCase().includes('support') || 
        r.name.toLowerCase().includes('staff') ||
        r.name.toLowerCase().includes('mod')
      );

      if (supportRole) {
        await ticketChannel.permissionOverwrites.create(supportRole, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
          AttachFiles: true,
          EmbedLinks: true
        });
      }

      const ticketData = {
        channelId: ticketChannel.id,
        userId: user.id,
        username: user.tag,
        category: category,
        reason: reason,
        contactInfo: contactInfo
      };

      await this.storage.createTicket(ticketData);

      const welcomeEmbed = TicketEmbed.createTicketWelcome(user, category, reason);
      const controls = TicketButtons.createTicketControls();

      await ticketChannel.send({
        content: `${user} ${supportRole ? supportRole : ''}`,
        embeds: [welcomeEmbed],
        components: [controls]
      });

      await this.logTicketAction(guild, ticketData, 'Created', user);

      logger.success('TICKET-MANAGER', `Created ticket ${ticketChannel.name} for ${user.tag}`);

      return {
        success: true,
        channel: ticketChannel
      };

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to create ticket: ${error.message}`);
      return {
        success: false,
        error: 'Failed to create ticket. Please contact an administrator.'
      };
    }
  }

  async closeTicket(channel, closedBy, reason = null) {
    try {
      const ticket = await this.storage.getTicket(channel.id);
      if (!ticket) {
        return { success: false, error: 'Ticket not found in database.' };
      }

      await this.storage.closeTicket(channel.id, closedBy.id);

      const closeEmbed = TicketEmbed.createTicketClosed(closedBy, reason);
      await channel.send({ embeds: [closeEmbed] });

      await this.logTicketAction(channel.guild, ticket, 'Closed', closedBy);

      logger.info('TICKET-MANAGER', `Ticket ${channel.name} closed by ${closedBy.tag}`);

      const parentCategory = channel.parent;

      setTimeout(async () => {
        try {
          await channel.delete();
          await this.storage.deleteTicket(channel.id);
          logger.info('TICKET-MANAGER', `Deleted ticket channel ${channel.name}`);

          if (parentCategory && parentCategory.name === CONFIG.settings.categoryChannelName) {
            const remainingChannels = parentCategory.children.cache.filter(c => c.id !== channel.id);
            
            if (remainingChannels.size === 0) {
              await parentCategory.delete();
              logger.info('TICKET-MANAGER', `Deleted empty ticket category ${parentCategory.name}`);
            } else {
              logger.info('TICKET-MANAGER', `Category ${parentCategory.name} has ${remainingChannels.size} remaining channels`);
            }
          }
        } catch (error) {
          logger.error('TICKET-MANAGER', `Failed to delete channel or category: ${error.message}`);
        }
      }, 10000);

      return { success: true };

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to close ticket: ${error.message}`);
      return { success: false, error: 'Failed to close ticket.' };
    }
  }

  async claimTicket(channel, claimer) {
    try {
      const ticket = await this.storage.getTicket(channel.id);
      if (!ticket) {
        return { success: false, error: 'Ticket not found.' };
      }

      await this.storage.updateTicket(channel.id, { claimedBy: claimer.id });

      await channel.send({
        embeds: [TicketEmbed.createSuccessEmbed(
          'Ticket Claimed',
          `${claimer} has claimed this ticket and will assist you.`
        )]
      });

      logger.info('TICKET-MANAGER', `Ticket ${channel.name} claimed by ${claimer.tag}`);
      return { success: true };

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to claim ticket: ${error.message}`);
      return { success: false, error: 'Failed to claim ticket.' };
    }
  }

  async generateTranscript(channel) {
    try {
      const messages = await channel.messages.fetch({ limit: 100 });
      const transcript = messages.reverse().map(msg => {
        const timestamp = new Date(msg.createdTimestamp).toLocaleString();
        return `[${timestamp}] ${msg.author.tag}: ${msg.content}`;
      }).join('\n');

      const buffer = Buffer.from(transcript, 'utf-8');
      
      return {
        success: true,
        buffer: buffer,
        filename: `transcript-${channel.name}-${Date.now()}.txt`
      };

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to generate transcript: ${error.message}`);
      return { success: false, error: 'Failed to generate transcript.' };
    }
  }

  async logTicketAction(guild, ticket, action, user) {
    try {
      const logChannel = guild.channels.cache.find(
        c => c.name === CONFIG.settings.logChannelName && c.type === ChannelType.GuildText
      );

      if (!logChannel) {
        logger.warn('TICKET-MANAGER', 'Log channel not found, skipping log');
        return;
      }

      const logEmbed = TicketEmbed.createTicketLog(ticket, action, user);
      await logChannel.send({ embeds: [logEmbed] });

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to log ticket action: ${error.message}`);
    }
  }

  async setupTicketPanel(channel) {
    try {
      const embed = TicketEmbed.createMainPanel();
      const button = TicketButtons.createMainPanelButton();

      await channel.send({
        embeds: [embed],
        components: [button]
      });

      logger.success('TICKET-MANAGER', `Ticket panel created in ${channel.name}`);
      return { success: true };

    } catch (error) {
      logger.error('TICKET-MANAGER', `Failed to setup ticket panel: ${error.message}`);
      return { success: false, error: 'Failed to create ticket panel.' };
    }
  }

  async getTicketStats(guild) {
    return await this.storage.getTicketStats();
  }
}

module.exports = TicketManager;
