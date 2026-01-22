/**
 * File: ticketModal.js
 * Author: Wildflover
 * Description: Modal forms for ticket creation and management
 * Language: JavaScript (Node.js)
 */

const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

class TicketModal {
  static createTicketForm(category) {
    const modal = new ModalBuilder()
      .setCustomId(`ticket_modal_${category}`)
      .setTitle('Create Support Ticket');

    const reasonInput = new TextInputBuilder()
      .setCustomId('ticket_reason')
      .setLabel('Describe your issue')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Please provide detailed information about your issue...')
      .setRequired(true)
      .setMinLength(10)
      .setMaxLength(1000);

    const contactInput = new TextInputBuilder()
      .setCustomId('ticket_contact')
      .setLabel('Additional contact info (optional)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Email, Discord tag, etc.')
      .setRequired(false)
      .setMaxLength(100);

    const firstActionRow = new ActionRowBuilder().addComponents(reasonInput);
    const secondActionRow = new ActionRowBuilder().addComponents(contactInput);

    modal.addComponents(firstActionRow, secondActionRow);
    return modal;
  }

  static createCloseReasonForm() {
    const modal = new ModalBuilder()
      .setCustomId('ticket_close_reason')
      .setTitle('Close Ticket');

    const reasonInput = new TextInputBuilder()
      .setCustomId('close_reason')
      .setLabel('Reason for closing (optional)')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Provide a reason for closing this ticket...')
      .setRequired(false)
      .setMaxLength(500);

    const actionRow = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(actionRow);
    return modal;
  }
}

module.exports = TicketModal;
