/**
 * File: ticketEmbed.js
 * Author: Wildflover
 * Description: Professional embed designs for ticket system
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');
const CONFIG = require('./ticketConfig');

class TicketEmbed {
  static createMainPanel() {
    const embed = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle('Support Ticket System')
      .setDescription('*Need assistance? We\'re here to help.*')
      .setImage('https://github.com/wiildflover/discord-autorole-bot/blob/main/ticket_banner.png?raw=true')
      .addFields(
        {
          name: 'How It Works',
          value: [
            'Click the button below to open a ticket',
            'Select your issue category',
            'Describe your problem in detail',
            'Our team will respond shortly'
          ].join('\n'),
          inline: false
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: false
        },
        {
          name: 'Available Categories',
          value: [
            `${CONFIG.categories.customMods.emoji} **Custom Mods**`,
            `Custom mod installation and compatibility issues`,
            '',
            `${CONFIG.categories.skins.emoji} **Skin Issues**`,
            `Skin loading and display problems`,
            '',
            `${CONFIG.categories.program.emoji} **Program Issues**`,
            `Launcher crashes and technical problems`
          ].join('\n'),
          inline: false
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: false
        },
        {
          name: 'Important Guidelines',
          value: [
            'Provide clear and detailed information',
            'Be patient while waiting for staff response',
            'Only create tickets for genuine support needs',
            `Check ${CONFIG.links.reportIssues} and ${CONFIG.links.commonIssues} first`
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ 
        text: 'All tickets are private and secure • Wildflover Support Team'
      })
      .setTimestamp();

    return embed;
  }

  static createTicketWelcome(user, category, reason) {
    const categoryData = CONFIG.categories[category];
    
    const embed = new EmbedBuilder()
      .setColor(0xF39C12)
      .setTitle(`${categoryData.emoji} ${categoryData.label}`)
      .setThumbnail('https://github.com/wiildflover/discord-autorole-bot/blob/main/ticket_banner.png?raw=true')
      .setDescription(`Welcome ${user}\n\nThank you for reaching out. Our support team has been notified and will assist you shortly.`)
      .addFields(
        {
          name: 'Ticket Information',
          value: `**Category:** ${categoryData.label}\n**Status:** ${CONFIG.status.open.emoji} Open\n**Created:** <t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: false
        },
        {
          name: 'Your Issue',
          value: reason || 'No description provided',
          inline: false
        },
        {
          name: 'What Happens Next',
          value: `Our support team will review your ticket\nAverage response time: 5-30 minutes\nFeel free to add more details or screenshots\nYou will be notified when staff responds`,
          inline: false
        }
      )
      .setFooter({ text: 'Use the buttons below to manage this ticket' })
      .setTimestamp();

    return embed;
  }

  static createTicketClosed(closedBy, reason) {
    const embed = new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle('Ticket Closed')
      .setThumbnail('https://github.com/wiildflover/discord-autorole-bot/blob/main/ticket_banner.png?raw=true')
      .setDescription('This support ticket has been resolved and closed.')
      .addFields(
        {
          name: 'Closure Details',
          value: `**Closed By:** ${closedBy}\n**Closed At:** <t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: false
        }
      );

    if (reason) {
      embed.addFields({
        name: 'Reason',
        value: reason,
        inline: false
      });
    }

    embed.addFields({
      name: '\u200B',
      value: 'This channel will be automatically deleted in 10 seconds.',
      inline: false
    });

    embed.setFooter({ text: 'Thank you for using our support system' });
    embed.setTimestamp();

    return embed;
  }

  static createTicketLog(ticket, action, user) {
    const categoryData = CONFIG.categories[ticket.category];
    
    const embed = new EmbedBuilder()
      .setColor(categoryData.color)
      .setTitle(`Ticket ${action}`)
      .addFields(
        {
          name: 'Ticket Details',
          value: [
            `**ID:** ${ticket.id}`,
            `**User:** <@${ticket.userId}>`,
            `**Category:** ${categoryData.emoji} ${categoryData.label}`
          ].join('\n'),
          inline: false
        }
      );

    if (action === 'Closed' && user) {
      embed.addFields({
        name: 'Closed By',
        value: user.toString(),
        inline: true
      });
    }

    if (ticket.reason) {
      embed.addFields({
        name: 'Issue Description',
        value: ticket.reason,
        inline: false
      });
    }

    embed.setTimestamp();
    return embed;
  }

  static createErrorEmbed(title, description) {
    return new EmbedBuilder()
      .setColor(0xED4245)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }

  static createSuccessEmbed(title, description) {
    return new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
  }
}

module.exports = TicketEmbed;
