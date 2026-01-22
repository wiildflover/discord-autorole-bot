/**
 * File: verifiedButtons.js
 * Author: Wildflover
 * Description: Button components for verified role system
 * Language: JavaScript (Node.js)
 */

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const VERIFIED_CONFIG = require('./verifiedConfig');

class VerifiedButtons {
  static createVerificationButton() {
    const button = new ButtonBuilder()
      .setCustomId('verified_get_role')
      .setLabel(VERIFIED_CONFIG.buttonLabel)
      .setStyle(ButtonStyle[VERIFIED_CONFIG.buttonStyle])
      .setEmoji(VERIFIED_CONFIG.buttonEmoji);

    return new ActionRowBuilder().addComponents(button);
  }
}

module.exports = VerifiedButtons;
