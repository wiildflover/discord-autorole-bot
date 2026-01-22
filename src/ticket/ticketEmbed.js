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
      .setColor(0x5865F2)
      .setTitle('🎫 Open a Support Ticket')
      .setDescription('*Need help? You\'re in the right place!*')
      .setImage(CONFIG.bannerImage)
      .addFields(
        {
          name: 'How it works:',
          value: [
            '🎫 Click the button below to create a ticket',
            '🔒 A private channel will be created just for you',
            '👥 Staff will respond as soon as possible',
            '✅ Ticket will be closed once resolved'
          ].join('\n'),
          inline: false
        },
        {
          name: 'When to open a ticket:',
          value: [
            `${CONFIG.categories.technical.emoji} **Technical support** (launcher / skins not working)`,
            `${CONFIG.categories.payment.emoji} **Payment issues** (orders, commissions, subscriptions)`,
            `${CONFIG.categories.account.emoji} **Account help** (login, access, roles)`,
            `${CONFIG.categories.other.emoji} **Other concerns** not covered elsewhere`
          ].join('\n'),
          inline: false
        },
        {
          name: 'Guidelines:',
          value: [
            '📝 Be clear and detailed about your issue',
            '⏳ Be patient while waiting for staff',
            '🚫 Only open tickets for real support needs'
          ].join('\n'),
          inline: false
        }
      )
      .addFields({
        name: '⚠️ Before opening a ticket:',
        value: `Check ${CONFIG.links.reportIssues} and ${CONFIG.links.commonIssues}`,
        inline: false
      })
      .setFooter({ 
        text: '🔐 Support tickets are private and only visible to you and staff',
        iconURL: 'https://cdn.discordapp.com/emojis/1234567890.png'
      })
      .setTimestamp();

    return embed;
  }

  static createTicketWelcome(user, category, reason) {
    const categoryData = CONFIG.categories[category];
    
    const embed = new EmbedBuilder()
      .setColor(categoryData.color)
      .setTitle(`${categoryData.emoji} ${categoryData.label}`)
      .setDescription(`Welcome ${user}, thank you for opening a support ticket.`)
      .addFields(
        {
          name: 'Category',
          value: `${categoryData.emoji} ${categoryData.label}`,
          inline: true
        },
        {
          name: 'Status',
          value: `${CONFIG.status.open.emoji} ${CONFIG.status.open.label}`,
          inline: true
        },
        {
          name: 'Created',
          value: `<t:${Math.floor(Date.now() / 1000)}:R>`,
          inline: true
        }
      )
      .addFields({
        name: 'Your Issue',
        value: reason || 'No description provided',
        inline: false
      })
      .addFields({
        name: 'What happens next?',
        value: [
          '👥 Our support team has been notified',
          '⏱️ Average response time: 5-30 minutes',
          '📝 Please provide any additional details',
          '🔔 You will be notified when staff responds'
        ].join('\n'),
        inline: false
      })
      .setFooter({ text: 'Use the buttons below to manage this ticket' })
      .setTimestamp();

    return embed;
  }

  static createTicketClosed(closedBy, reason) {
    const embed = new EmbedBuilder()
      .setColor(CONFIG.status.closed.color)
      .setTitle('🔒 Ticket Closed')
      .setDescription('This support ticket has been closed.')
      .addFields(
        {
          name: 'Closed By',
          value: closedBy.toString(),
          inline: true
        },
        {
          name: 'Closed At',
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true
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
      name: 'Channel Deletion',
      value: 'This channel will be deleted in 10 seconds.',
      inline: false
    });

    return embed;
  }

  static createTicketLog(ticket, action, user) {
    const categoryData = CONFIG.categories[ticket.category];
    
    const embed = new EmbedBuilder()
      .setColor(categoryData.color)
      .setTitle(`📋 Ticket ${action}`)
      .addFields(
        {
          name: 'Ticket ID',
          value: ticket.id,
          inline: true
        },
        {
          name: 'User',
          value: `<@${ticket.userId}>`,
          inline: true
        },
        {
          name: 'Category',
          value: `${categoryData.emoji} ${categoryData.label}`,
          inline: true
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
        name: 'Reason',
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
      .setTitle(`❌ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }

  static createSuccessEmbed(title, description) {
    return new EmbedBuilder()
      .setColor(0x57F287)
      .setTitle(`✅ ${title}`)
      .setDescription(description)
      .setTimestamp();
  }
}

module.exports = TicketEmbed;
