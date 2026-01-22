/**
 * File: definitions.js
 * Author: Wildflover
 * Description: Slash command definitions for Discord bot
 * Language: JavaScript (Node.js)
 */

const { SlashCommandBuilder } = require('discord.js');

const commands = {
  ping: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot response time and status'),

  info: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Display bot information and statistics'),

  config: new SlashCommandBuilder()
    .setName('config')
    .setDescription('View current bot configuration (Admin only)'),

  help: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display available commands and usage information'),

  tutorial: new SlashCommandBuilder()
    .setName('tutorial')
    .setDescription('Wildflover Skin Manager comprehensive guide')
    .addStringOption(option =>
      option.setName('topic')
        .setDescription('Select tutorial topic')
        .setRequired(true)
        .addChoices(
          { name: 'Main Menu', value: 'menu' },
          { name: 'Home Screen', value: 'home' },
          { name: 'Champions Library', value: 'champions' },
          { name: 'Skin Details', value: 'skinpage' },
          { name: 'Chroma System', value: 'chroma' },
          { name: 'Marketplace', value: 'marketplace' },
          { name: 'Marketplace Filters', value: 'filters' },
          { name: 'Download History', value: 'history' },
          { name: 'Custom Skins', value: 'customs' },
          { name: 'Activation System', value: 'activate' },
          { name: 'Settings', value: 'settings' },
          { name: 'Troubleshooting', value: 'troubleshoot' }
        ))
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Select language')
        .setRequired(false)
        .addChoices(
          { name: 'English', value: 'en' },
          { name: 'Türkçe', value: 'tr' }
        )),

  setwelcome: new SlashCommandBuilder()
    .setName('setwelcome')
    .setDescription('Set welcome/leave message channel (Admin only)')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel for welcome and leave messages')
        .setRequired(true)),

  ticket: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket system management (Admin only)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup ticket panel in current channel'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('stats')
        .setDescription('View ticket statistics'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Force close current ticket channel')),

  verified: new SlashCommandBuilder()
    .setName('verified')
    .setDescription('Verification system management (Admin only)')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Setup verification panel in current channel'))
};

module.exports = commands;
