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
      const canvas = createCanvas(1024, 450);
      const ctx = canvas.getContext('2d');

      // Draw background
      const background = await loadImage(BACKGROUND_URL);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      // Dark overlay for better text visibility
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw WELCOME/GOODBYE text at top
      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      ctx.font = 'bold 70px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add strong shadow for text
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      
      ctx.fillText(messageText, canvas.width / 2, 80);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw avatar in center-top area
      const avatarSize = 150;
      const avatarX = canvas.width / 2;
      const avatarY = 200;

      // Clip for circular avatar
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      // Draw avatar
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

      // Draw gradient border around avatar
      const gradient = ctx.createLinearGradient(
        avatarX - avatarSize / 2 - 6,
        avatarY - avatarSize / 2 - 6,
        avatarX + avatarSize / 2 + 6,
        avatarY + avatarSize / 2 + 6
      );
      gradient.addColorStop(0, '#9B59B6');
      gradient.addColorStop(0.5, '#E91E63');
      gradient.addColorStop(1, '#9B59B6');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw username below avatar
      const username = member.user.username;
      ctx.font = 'bold 42px sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 1)';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      
      ctx.fillText(username, canvas.width / 2, 310);

      // Draw welcome message
      const subText = type === 'welcome' 
        ? 'Welcome to Wildflover Community!' 
        : 'Thanks for being part of our community!';
      
      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#E0E0E0';
      ctx.fillText(subText, canvas.width / 2, 360);

      // Draw member count
      const memberCount = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again';
      
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#AAAAAA';
      ctx.fillText(memberCount, canvas.width / 2, 400);

      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: `${type}-${member.id}.png`
      });

      logger.success('WELCOME-CARD', `Generated ${type} card for ${member.user.tag}`);
      return attachment;
    } catch (error) {
      logger.error('WELCOME-CARD', `Failed to generate card: ${error.message}`);
      logger.error('WELCOME-CARD', `Stack: ${error.stack}`);
      return null;
    }
  }
}

module.exports = WelcomeCardGenerator;
