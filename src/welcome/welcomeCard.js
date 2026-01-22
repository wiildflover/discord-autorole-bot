/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with Discord embed for text
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://github.com/wiildflover/discord-autorole-bot/blob/main/welcome_banner.png?raw=true';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Generating ${type} card for ${member.user.tag}`);
      
      const canvas = createCanvas(1200, 500);
      const ctx = canvas.getContext('2d');

      // Load and draw background with proper aspect ratio
      const background = await loadImage(BACKGROUND_URL);
      const bgAspect = background.width / background.height;
      const canvasAspect = 1200 / 500;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (bgAspect > canvasAspect) {
        drawHeight = 500;
        drawWidth = 500 * bgAspect;
        offsetX = (1200 - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = 1200;
        drawHeight = 1200 / bgAspect;
        offsetX = 0;
        offsetY = (500 - drawHeight) / 2;
      }
      
      ctx.drawImage(background, offsetX, offsetY, drawWidth, drawHeight);

      // Apply dark overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, 1200, 500);

      // Load and draw avatar
      const avatarX = 600;
      const avatarY = 200;
      const avatarRadius = 90;

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );

      // Draw avatar with clipping
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - avatarRadius, avatarY - avatarRadius, avatarRadius * 2, avatarRadius * 2);
      ctx.restore();

      // Draw gradient border around avatar (orange theme)
      const gradient = ctx.createLinearGradient(avatarX - avatarRadius - 10, avatarY - avatarRadius - 10, avatarX + avatarRadius + 10, avatarY + avatarRadius + 10);
      gradient.addColorStop(0, '#F39C12');
      gradient.addColorStop(0.5, '#E67E22');
      gradient.addColorStop(1, '#F39C12');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius + 5, 0, Math.PI * 2);
      ctx.stroke();

      // Draw username with @ symbol
      ctx.font = 'bold 42px Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      const username = `@${member.user.username}`;
      ctx.fillText(username, avatarX, 340);

      // Draw welcome message
      ctx.font = 'bold 36px Arial, sans-serif';
      ctx.fillStyle = '#F39C12';
      ctx.fillText('Welcome to Wildflover Community!', avatarX, 395);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      const buffer = canvas.toBuffer('image/png');
      const attachment = new AttachmentBuilder(buffer, {
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

  static getMessage(member, type = 'welcome') {
    return `**WELCOME** ${member} Welcome to **Wildflover Community!**`;
  }
}

module.exports = WelcomeCardGenerator;
