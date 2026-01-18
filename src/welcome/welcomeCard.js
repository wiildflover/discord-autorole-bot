/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with custom background and avatar
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Starting card generation for ${member.user.tag}`);
      
      const canvas = createCanvas(1024, 450);
      const ctx = canvas.getContext('2d');

      logger.info('WELCOME-CARD', 'Loading background image');
      const background = await loadImage(BACKGROUND_URL);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      logger.info('WELCOME-CARD', 'Drawing overlay');
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      logger.info('WELCOME-CARD', 'Drawing welcome text');
      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      ctx.save();
      ctx.font = '70px Impact, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.strokeText(messageText, canvas.width / 2, 50);
      ctx.fillText(messageText, canvas.width / 2, 50);
      ctx.restore();

      logger.info('WELCOME-CARD', 'Loading and drawing avatar');
      const avatarSize = 150;
      const avatarX = canvas.width / 2;
      const avatarY = 180;

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        avatar,
        avatarX - avatarSize / 2,
        avatarY - avatarSize / 2,
        avatarSize,
        avatarSize
      );
      ctx.restore();

      logger.info('WELCOME-CARD', 'Drawing avatar border');
      ctx.save();
      const gradient = ctx.createLinearGradient(
        avatarX - avatarSize / 2,
        avatarY - avatarSize / 2,
        avatarX + avatarSize / 2,
        avatarY + avatarSize / 2
      );
      gradient.addColorStop(0, '#9B59B6');
      gradient.addColorStop(0.5, '#E91E63');
      gradient.addColorStop(1, '#9B59B6');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      logger.info('WELCOME-CARD', 'Drawing username');
      const username = member.user.username;
      ctx.save();
      ctx.font = '42px Impact, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeText(username, canvas.width / 2, 280);
      ctx.fillText(username, canvas.width / 2, 280);
      ctx.restore();

      logger.info('WELCOME-CARD', 'Drawing welcome message');
      const subText = type === 'welcome' 
        ? 'Welcome to Wildflover Community!' 
        : 'Thanks for being part of our community!';
      ctx.save();
      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#E0E0E0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(subText, canvas.width / 2, 340);
      ctx.restore();

      logger.info('WELCOME-CARD', 'Drawing member count');
      const memberCount = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again';
      ctx.save();
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#AAAAAA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(memberCount, canvas.width / 2, 380);
      ctx.restore();

      logger.info('WELCOME-CARD', 'Creating attachment');
      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
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
