/**
 * File: ticketConfig.js
 * Author: Wildflover
 * Description: Ticket system configuration and category definitions
 * Language: JavaScript (Node.js)
 */

const TICKET_CONFIG = {
  // Ticket categories with custom styling
  categories: {
    technical: {
      emoji: '🔧',
      label: 'Technical Support',
      description: 'Launcher / Skins not working',
      color: 0xE74C3C,
      channelPrefix: 'tech-support'
    },
    payment: {
      emoji: '💳',
      label: 'Payment Issues',
      description: 'Orders, commissions, subscriptions',
      color: 0xF39C12,
      channelPrefix: 'payment'
    },
    account: {
      emoji: '👤',
      label: 'Account Help',
      description: 'Login, access, roles',
      color: 0x3498DB,
      channelPrefix: 'account'
    },
    other: {
      emoji: '❓',
      label: 'Other Concerns',
      description: 'Not covered elsewhere',
      color: 0x95A5A6,
      channelPrefix: 'other'
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
  bannerImage: 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/discord/welcome_banner.png',

  // Support links
  links: {
    reportIssues: '#report-issues',
    commonIssues: '#common-issues'
  }
};

module.exports = TICKET_CONFIG;
