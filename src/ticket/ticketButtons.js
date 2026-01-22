/**
 * File: ticketButtons.js
 * Author: Wildflover
 * Description: Button components and action rows for ticket system
 * Language: JavaScript (Node.js)
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const CONFIG = require('./ticketConfig');

class TicketButtons {
  static createMainPanelButton() {
    const button = new ButtonBuilder()
      .setCustomId('ticket_create')
      .setLabel('Create Ticket')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Primary);

    return new ActionRowBuilder().addComponents(button);
  }

  static createCategorySelector() {
    const options = Object.entries(CONFIG.categories).map(([key, category]) => ({
      label: category.label,
      description: category.description,
      value: key,
      emoji: category.emoji
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category_select')
      .setPlaceholder('Select a support category')
      .addOptions(options);

    return new ActionRowBuilder().addComponents(selectMenu);
  }

  static createTicketControls() {
    const closeButton = new ButtonBuilder()
      .setCustomId('ticket_close')
      .setLabel('Close Ticket')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger);

    const claimButton = new ButtonBuilder()
      .setCustomId('ticket_claim')
      .setLabel('Claim')
      .setEmoji('✋')
      .setStyle(ButtonStyle.Success);

    const transcriptButton = new ButtonBuilder()
      .setCustomId('ticket_transcript')
      .setLabel('Transcript')
      .setEmoji('📄')
      .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder().addComponents(closeButton, claimButton, transcriptButton);
  }

  static createCloseConfirmation() {
    const confirmButton = new ButtonBuilder()
      .setCustomId('ticket_close_confirm')
      .setLabel('Confirm Close')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('ticket_close_cancel')
      .setLabel('Cancel')
      .setEmoji('❌')
      .setStyle(ButtonStyle.Secondary);

    return new ActionRowBuilder().addComponents(confirmButton, cancelButton);
  }

  static createReopenButton() {
    const button = new ButtonBuilder()
      .setCustomId('ticket_reopen')
      .setLabel('Reopen Ticket')
      .setEmoji('🔓')
      .setStyle(ButtonStyle.Success);

    return new ActionRowBuilder().addComponents(button);
  }

  static createDeleteButton() {
    const button = new ButtonBuilder()
      .setCustomId('ticket_delete')
      .setLabel('Delete Channel')
      .setEmoji('🗑️')
      .setStyle(ButtonStyle.Danger);

    return new ActionRowBuilder().addComponents(button);
  }
}

module.exports = TicketButtons;
