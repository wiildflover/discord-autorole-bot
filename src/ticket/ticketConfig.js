/**
 * File: ticketConfig.js
 * Author: Wildflover
 * Description: Ticket system configuration and category definitions
 * Language: JavaScript (Node.js)
 */

const TICKET_CONFIG = {
  // Ticket categories with custom styling
  categories: {
    customMods: {
      emoji: '🎨',
      label: 'Custom Mods',
      description: 'Custom mod installation and compatibility issues',
      color: 0x9B59B6,
      channelPrefix: 'custom-mods'
    },
    skins: {
      emoji: '✨',
      label: 'Skin Issues',
      description: 'Skin loading and display problems',
      color: 0xE74C3C,
      channelPrefix: 'skin-support'
    },
    program: {
      emoji: '⚙️',
      label: 'Program Issues',
      description: 'Launcher crashes and technical problems',
      color: 0x3498DB,
      channelPrefix: 'program-support'
    }
  },

  // Ticket status definitions
  status: {
    open: {
      emoji: '🟢',
      label: 'Open',
      color: 0x57F287
    },
    pending: {
      emoji: '🟡',
      label: 'Pending',
      color: 0xFEE75C
    },
    closed: {
      emoji: '🔴',
      label: 'Closed',
      color: 0xED4245
    }
  },

  // Ticket settings
  settings: {
    maxTicketsPerUser: 3,
    autoCloseInactiveAfter: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    transcriptEnabled: true,
    categoryChannelName: 'TICKETS',
    logChannelName: 'ticket-logs'
  },

  // Embed banner image
  bannerImage: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/ticket_banner.png?raw=true',

  // Support links
  links: {
    reportIssues: '#report-issues',
    commonIssues: '#common-issues'
  }
};

module.exports = TICKET_CONFIG;
