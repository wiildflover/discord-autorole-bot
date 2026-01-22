/**
 * File: verifiedEmbed.js
 * Author: Wildflover
 * Description: Embed generator for verified role system
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');
const VERIFIED_CONFIG = require('./verifiedConfig');

class VerifiedEmbed {
  static createVerificationPanel() {
    return new EmbedBuilder()
      .setColor(VERIFIED_CONFIG.embedColor)
      .setAuthor({
        name: 'Application Access Verification',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setImage(VERIFIED_CONFIG.bannerUrl)
      .setDescription(
        'Welcome to the Wildflover Community verification system. ' +
        'To gain full access to our custom skin manager application and exclusive features, ' +
        'please complete the verification process by clicking the button below.\n\n' +
        '**What You\'ll Get:**\n' +
        '▸ Full access to Wildflover Skin Manager\n' +
        '▸ Exclusive custom skin library\n' +
        '▸ Marketplace download privileges\n' +
        '▸ Community support channels\n' +
        '▸ Early access to new features\n\n' +
        '**Ready to begin?** Click the verification button to proceed.'
      )
      .setFooter({ 
        text: 'Wildflover Community • Verification System',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setTimestamp();
  }

  static createSuccessEmbed(member) {
    return new EmbedBuilder()
      .setColor(0x2ECC71)
      .setAuthor({
        name: 'Verification Successful',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setDescription(
        `${member}, you have been successfully verified!\n\n` +
        'You now have full access to:\n' +
        '▸ Application download channels\n' +
        '▸ Custom skin marketplace\n' +
        '▸ Community support system\n' +
        '▸ Exclusive member features\n\n' +
        'Welcome to the Wildflover Community!'
      )
      .setFooter({ 
        text: 'Wildflover Community',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setTimestamp();
  }

  static createAlreadyVerifiedEmbed(member) {
    return new EmbedBuilder()
      .setColor(0xE67E22)
      .setAuthor({
        name: 'Already Verified',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setDescription(
        `${member}, you are already verified and have full access to all features.`
      )
      .setFooter({ 
        text: 'Wildflover Community',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setTimestamp();
  }
}

module.exports = VerifiedEmbed;
