/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator using Canvacord
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { WelcomeCard } = require('canvacord');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Generating ${type} card for ${member.user.tag}`);
      
      const card = new WelcomeCard()
        .setDisplayName(member.user.username)
        .setUsername(`@${member.user.username}`)
        .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 256 }))
        .setMessage(type === 'welcome' ? 'Welcome to Wildflover Community!' : 'Thanks for being part of our community!')
        .setBackground(BACKGROUND_URL)
        .setOverlayOpacity(0.7);

      if (type === 'welcome') {
        card.setTitle('WELCOME');
        card.setSubtitle(`Member #${member.guild.memberCount}`);
      } else {
        card.setTitle('GOODBYE');
        card.setSubtitle('We hope to see you again');
      }

      const image = await card.build();
      const attachment = new AttachmentBuilder(image, {
        name: `${type}-${member.id}.png`
      });

      logger.success('WELCOME-CARD', `Card generated successfully for ${member.user.tag}`);
      return attachment;
    } catch (error) {
      logger.error('WELCOME-CARD', `Error: ${error.message}`);
      logger.error('WELCOME-CARD', `Stack: ${error.stack}`);
      return null;
    }
  }
}

module.exports = WelcomeCardGenerator;
