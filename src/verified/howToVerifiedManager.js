/**
 * File: howToVerifiedManager.js
 * Author: Wildflover
 * Description: Manager for how-to-verified guide panel setup
 * Language: JavaScript (Node.js)
 */

const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const HowToVerifiedEmbed = require('./howToVerifiedEmbed');

class HowToVerifiedManager {
  constructor(client) {
    this.client = client;
  }

  async setupGuidePanel(interaction) {
    try {
      // Check admin permissions
      if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await interaction.reply({
          content: 'Only administrators can setup the verification guide panel.',
          ephemeral: true
        });
      }

      await interaction.deferReply({ ephemeral: true });

      // Create and send guide embed
      const embed = HowToVerifiedEmbed.createGuideEmbed();

      await interaction.channel.send({
        embeds: [embed]
      });

      logger.success('HOWTOVERIFIED-MANAGER', `Guide panel setup in ${interaction.channel.name} by ${interaction.user.tag}`);

      await interaction.editReply({
        content: 'Verification guide panel has been successfully setup in this channel.'
      });

    } catch (error) {
      logger.error('HOWTOVERIFIED-MANAGER', `Failed to setup guide panel: ${error.message}`);
      
      if (interaction.deferred) {
        await interaction.editReply({
          content: 'Failed to setup verification guide panel. Please check bot permissions and try again.'
        });
      } else if (!interaction.replied) {
        await interaction.reply({
          content: 'Failed to setup verification guide panel. Please check bot permissions and try again.',
          ephemeral: true
        });
      }
    }
  }
}

module.exports = HowToVerifiedManager;
