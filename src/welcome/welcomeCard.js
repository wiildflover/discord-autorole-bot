/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator using discord-canvas library
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const Canvas = require('discord-canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Starting card generation for ${member.user.tag}`);
      
      const isWelcome = type === 'welcome';
      const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
      
      let image;
      
      if (isWelcome) {
        image = await new Canvas.Welcome()
          .setUsername(member.user.username)
          .setDiscriminator(member.user.discriminator || '0')
          .setMemberCount(member.guild.memberCount)
          .setGuildName(member.guild.name)
          .setAvatar(avatarURL)
          .setColor('border', '#9B59B6')
          .setColor('username-box', '#9B59B6')
          .setColor('discriminator-box', '#E91E63')
          .setColor('message-box', '#9B59B6')
          .setColor('title', '#FFFFFF')
          .setColor('avatar', '#9B59B6')
          .setBackground(BACKGROUND_URL)
          .toAttachment();
      } else {
        image = await new Canvas.Goodbye()
          .setUsername(member.user.username)
          .setDiscriminator(member.user.discriminator || '0')
          .setMemberCount(member.guild.memberCount)
          .setGuildName(member.guild.name)
          .setAvatar(avatarURL)
          .setColor('border', '#9B59B6')
          .setColor('username-box', '#9B59B6')
          .setColor('discriminator-box', '#E91E63')
          .setColor('message-box', '#9B59B6')
          .setColor('title', '#FFFFFF')
          .setColor('avatar', '#9B59B6')
          .setBackground(BACKGROUND_URL)
          .toAttachment();
      }

      const attachment = new AttachmentBuilder(image.toBuffer(), {
        name: `${type}-${member.id}.png`
      });

      logger.success('WELCOME-CARD', `Successfully generated ${type} card for ${member.user.tag}`);
      return attachment;
    } catch (error) {
      logger.error('WELCOME-CARD', `Failed to generate card: ${error.message}`);
      logger.error('WELCOME-CARD', `Stack: ${error.stack}`);
      return null;
    }
  }
}

module.exports = WelcomeCardGenerator;
