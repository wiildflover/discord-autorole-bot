/**
 * File: verifiedManager.js
 * Author: Wildflover
 * Description: Manager for verified role system setup and operations
 * Language: JavaScript (Node.js)
 */

const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const VerifiedEmbed = require('./verifiedEmbed');
const VerifiedButtons = require('./verifiedButtons');

class VerifiedManager {
  constructor(client, config) {
    this.client = client;
    this.config = config;
  }

  async setupVerificationPanel(interaction) {
    try {
      // Check admin permissions
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({
          content: 'Only administrators can setup the verification panel.',
          ephemeral: true
        });
      }

      // Check if role is configured
      if (!this.config.roleId) {
        return await interaction.reply({
          content: 'Verification role is not configured. Please set ROLE_ID in configuration.',
          ephemeral: true
        });
      }

      const role = interaction.guild.roles.cache.get(this.config.roleId);
      if (!role) {
        return await interaction.reply({
          content: `Verification role not found (ID: ${this.config.roleId}). Please check configuration.`,
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      // Create and send verification panel
      const embed = VerifiedEmbed.createVerificationPanel();
      const button = VerifiedButtons.createVerificationButton();

      await interaction.channel.send({
        embeds: [embed],
        components: [button]
      });

      logger.success('VERIFIED-MANAGER', `Verification panel setup in ${interaction.channel.name} by ${interaction.user.tag}`);

      await interaction.editReply({
        content: `Verification panel has been successfully setup in this channel.\nRole: ${role.name}`
      });

    } catch (error) {
      logger.error('VERIFIED-MANAGER', `Failed to setup verification panel: ${error.message}`);
      
      if (interaction.deferred) {
        await interaction.editReply({
          content: 'Failed to setup verification panel. Please check bot permissions and try again.'
        });
      } else if (!interaction.replied) {
        await interaction.reply({
          content: 'Failed to setup verification panel. Please check bot permissions and try again.',
          ephemeral: true
        });
      }
    }
  }
}

module.exports = VerifiedManager;
