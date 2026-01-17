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
    .setDescription('Display available commands and usage information')
};

module.exports = commands;
