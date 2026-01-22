/**
 * File: ticketHandler.js
 * Author: Wildflover
 * Description: Interaction handlers for ticket system buttons, modals and select menus
 * Language: JavaScript (Node.js)
 */

const logger = require('../utils/logger');
const TicketManager = require('./ticketManager');
const TicketButtons = require('./ticketButtons');
const TicketModal = require('./ticketModal');
const TicketEmbed = require('./ticketEmbed');
const { PermissionFlagsBits, AttachmentBuilder } = require('discord.js');

class TicketHandler {
  constructor(client) {
    this.client = client;
    this.manager = new TicketManager(client);
    this.selectedCategories = new Map();
  }

  async initialize() {
    await this.manager.initialize();
  }

  async handleInteraction(interaction) {
    try {
      if (interaction.isButton()) {
        await this.handleButton(interaction);
      } else if (interaction.isStringSelectMenu()) {
        await this.handleSelectMenu(interaction);
      } else if (interaction.isModalSubmit()) {
        await this.handleModal(interaction);
      }
    } catch (error) {
      logger.error('TICKET-HANDLER', `Interaction error: ${error.message}`);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'An error occurred while processing your request.',
          ephemeral: true
        });
      }
    }
  }

  async handleButton(interaction) {
    const customId = interaction.customId;

    switch (customId) {
      case 'ticket_create':
        await this.handleCreateButton(interaction);
        break;
      case 'ticket_close':
        await this.handleCloseButton(interaction);
        break;
      case 'ticket_close_confirm':
        await this.handleCloseConfirm(interaction);
        break;
      case 'ticket_close_cancel':
        await this.handleCloseCancel(interaction);
        break;
      case 'ticket_claim':
        await this.handleClaimButton(interaction);
        break;
      case 'ticket_transcript':
        await this.handleTranscriptButton(interaction);
        break;
      case 'ticket_reopen':
        await this.handleReopenButton(interaction);
        break;
      case 'ticket_delete':
        await this.handleDeleteButton(interaction);
        break;
      default:
        logger.warn('TICKET-HANDLER', `Unknown button: ${customId}`);
    }
  }

  async handleCreateButton(interaction) {
    const categorySelector = TicketButtons.createCategorySelector();
    
    await interaction.reply({
      content: 'Please select a support category:',
      components: [categorySelector],
      ephemeral: true
    });

    logger.info('TICKET-HANDLER', `Category selector shown to ${interaction.user.tag}`);
  }

  async handleSelectMenu(interaction) {
    if (interaction.customId === 'ticket_category_select') {
      const category = interaction.values[0];
      this.selectedCategories.set(interaction.user.id, category);

      const modal = TicketModal.createTicketForm(category);
      await interaction.showModal(modal);

      logger.info('TICKET-HANDLER', `Modal shown for category ${category} to ${interaction.user.tag}`);
    }
  }

  async handleModal(interaction) {
    if (interaction.customId.startsWith('ticket_modal_')) {
      await this.handleTicketCreation(interaction);
    } else if (interaction.customId === 'ticket_close_reason') {
      await this.handleCloseWithReason(interaction);
    }
  }

  async handleTicketCreation(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const category = this.selectedCategories.get(interaction.user.id);
    if (!category) {
      await interaction.editReply({
        content: 'Session expired. Please try again.',
        ephemeral: true
      });
      return;
    }

    const reason = interaction.fields.getTextInputValue('ticket_reason');
    const contactInfo = interaction.fields.getTextInputValue('ticket_contact') || null;

    const result = await this.manager.createTicket(interaction, category, reason, contactInfo);

    if (result.success) {
      await interaction.editReply({
        content: `Ticket created successfully! ${result.channel}`,
        ephemeral: true
      });
      this.selectedCategories.delete(interaction.user.id);
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleCloseButton(interaction) {
    const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) ||
                          interaction.channel.name.includes(interaction.user.id);

    if (!hasPermission) {
      await interaction.reply({
        content: 'You do not have permission to close this ticket.',
        ephemeral: true
      });
      return;
    }

    const confirmButtons = TicketButtons.createCloseConfirmation();
    await interaction.reply({
      content: 'Are you sure you want to close this ticket?',
      components: [confirmButtons],
      ephemeral: true
    });

    logger.info('TICKET-HANDLER', `Close confirmation shown to ${interaction.user.tag}`);
  }

  async handleCloseConfirm(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const result = await this.manager.closeTicket(interaction.channel, interaction.user);

    if (result.success) {
      await interaction.editReply({
        content: 'Ticket is being closed. Channel will be deleted in 10 seconds.',
        ephemeral: true
      });
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleCloseCancel(interaction) {
    await interaction.update({
      content: 'Ticket close cancelled.',
      components: [],
      ephemeral: true
    });

    logger.info('TICKET-HANDLER', `Close cancelled by ${interaction.user.tag}`);
  }

  async handleClaimButton(interaction) {
    const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.ManageMessages);

    if (!hasPermission) {
      await interaction.reply({
        content: 'Only staff members can claim tickets.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply();

    const result = await this.manager.claimTicket(interaction.channel, interaction.user);

    if (result.success) {
      await interaction.deleteReply();
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleTranscriptButton(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const result = await this.manager.generateTranscript(interaction.channel);

    if (result.success) {
      const attachment = new AttachmentBuilder(result.buffer, { name: result.filename });
      
      await interaction.editReply({
        content: 'Ticket transcript generated:',
        files: [attachment],
        ephemeral: true
      });

      logger.info('TICKET-HANDLER', `Transcript generated for ${interaction.channel.name}`);
    } else {
      await interaction.editReply({
        content: result.error,
        ephemeral: true
      });
    }
  }

  async handleReopenButton(interaction) {
    await interaction.reply({
      content: 'Reopen functionality coming soon.',
      ephemeral: true
    });
  }

  async handleDeleteButton(interaction) {
    const hasPermission = interaction.member.permissions.has(PermissionFlagsBits.ManageChannels);

    if (!hasPermission) {
      await interaction.reply({
        content: 'You do not have permission to delete this channel.',
        ephemeral: true
      });
      return;
    }

    await interaction.reply({
      content: 'Deleting channel...',
      ephemeral: true
    });

    setTimeout(async () => {
      await interaction.channel.delete();
    }, 2000);
  }
}

module.exports = TicketHandler;
