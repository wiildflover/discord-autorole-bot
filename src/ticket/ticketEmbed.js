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
      .setDescription('Need assistance? We\'re here to help.')
      .setImage('https://github.com/wiildflover/discord-autorole-bot/blob/main/ticket_banner.png?raw=true')
      .addFields(
        {
          name: 'How It Works',
          value: '**Step 1** - Click the button below to open a ticket\n**Step 2** - Select your issue category\n**Step 3** - Describe your problem in detail\n**Step 4** - Our team will respond shortly',
          inline: false
        },
        {
          name: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
          value: '\u200B',
          inline: false
        },
        {
          name: `${CONFIG.categories.customMods.emoji} Custom Mods`,
          value: 'Custom mod installation and compatibility issues',
          inline: true
        },
        {
          name: `${CONFIG.categories.skins.emoji} Skin Issues`,
          value: 'Skin loading and display problems',
          inline: true
        },
        {
          name: `${CONFIG.categories.program.emoji} Program Issues`,
          value: 'Launcher crashes and technical problems',
          inline: true
        },
        {
          name: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
          value: '\u200B',
          inline: false
        },
        {
          name: 'Important Guidelines',
          value: '**Clear Information** - Provide detailed information about your issue\n**Patience** - Be patient while waiting for staff response\n**Genuine Support** - Only create tickets for genuine support needs\n**Check First** - Review #report-issues and #common-issues before creating ticket',
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
