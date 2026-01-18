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
};

module.exports = commands;
