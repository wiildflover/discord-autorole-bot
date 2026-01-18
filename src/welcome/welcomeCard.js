/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator using Canvacord Welcomer
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Generating ${type} card for ${member.user.tag}`);
      
      const card = new canvacord.Welcomer()
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator || '0')
        .setAvatar(member.user.displayAvatarURL({ extension: 'png', size: 256 }))
        .setColor('title', '#9B59B6')
        .setColor('username-box', '#E91E63')
        .setColor('discriminator-box', '#9B59B6')
        .setColor('message-box', '#9B59B6')
        .setColor('border', '#E91E63')
        .setColor('avatar', '#9B59B6')
        .setBackground(BACKGROUND_URL)
        .setMemberCount(member.guild.memberCount);

      if (type === 'welcome') {
        card.setTitle('WELCOME');
        card.setText('message', 'Welcome to Wildflover Community!');
      } else {
        card.setTitle('GOODBYE');
        card.setText('message', 'Thanks for being part of our community!');
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
