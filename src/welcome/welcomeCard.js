/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with custom background and avatar
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const SPLASH_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_splash_login.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      const canvas = createCanvas(1024, 450);
      const ctx = canvas.getContext('2d');

      const background = await loadImage(SPLASH_URL);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const avatarSize = 180;
      const avatarX = canvas.width / 2;
      const avatarY = 140;

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );
      ctx.drawImage(
        avatar,
        avatarX - avatarSize / 2,
        avatarY - avatarSize / 2,
        avatarSize,
        avatarSize
      );

      ctx.restore();

      ctx.strokeStyle = '#5865F2';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();

      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(messageText, canvas.width / 2, 280);

      const username = member.user.username;
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#5865F2';
      ctx.fillText(username, canvas.width / 2, 330);

      const subText = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again!';
      ctx.font = '24px Arial';
      ctx.fillStyle = '#CCCCCC';
      ctx.fillText(subText, canvas.width / 2, 370);

      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: `${type}-${member.id}.png`
      });

      logger.info('WELCOME-CARD', `Generated ${type} card for ${member.user.tag}`);
      return attachment;
    } catch (error) {
      logger.error('WELCOME-CARD', `Failed to generate card: ${error.message}`);
      return null;
    }
  }
}

module.exports = WelcomeCardGenerator;
