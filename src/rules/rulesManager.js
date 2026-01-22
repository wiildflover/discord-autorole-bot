/**
 * File: rulesManager.js
 * Author: Wildflover
 * Description: Server rules panel management system
 * Language: JavaScript (Node.js)
 */

const RulesEmbed = require('./rulesEmbed');
const logger = require('../utils/logger');

class RulesManager {
  constructor(client) {
    this.client = client;
  }

  async setupRulesPanel(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const channel = interaction.channel;
      const embed = RulesEmbed.createRulesPanel();

      // Send rules embed with @everyone mention
      await channel.send({
        content: '@everyone',
        embeds: [embed]
      });

      await interaction.editReply({
        content: 'Server rules panel has been successfully created in this channel.',
        ephemeral: true
      });

      logger.success('RULES-MANAGER', `Rules panel setup by ${interaction.user.tag} in ${channel.name}`);

      return { success: true };
    } catch (error) {
      logger.error('RULES-MANAGER', `Failed to setup rules panel: ${error.message}`);
      
      await interaction.editReply({
        content: 'Failed to setup rules panel. Please check bot permissions and try again.',
        ephemeral: true
      });

      return { success: false, error: error.message };
    }
  }
}

module.exports = RulesManager;
