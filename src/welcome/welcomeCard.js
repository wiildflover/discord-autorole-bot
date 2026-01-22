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
      
      const canvas = createCanvas(1024, 450);
      const ctx = canvas.getContext('2d');

      // Load and draw background
      const background = await loadImage(BACKGROUND_URL);
      ctx.drawImage(background, 0, 0, 1024, 450);

      // Apply dark overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 1024, 450);

      // Load and draw avatar
      const avatarX = 512;
      const avatarY = 225;

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );

      // Draw avatar with clipping
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 100, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - 100, avatarY - 100, 200, 200);
      ctx.restore();

      // Draw gradient border around avatar
      const gradient = ctx.createLinearGradient(avatarX - 110, avatarY - 110, avatarX + 110, avatarY + 110);
      gradient.addColorStop(0, '#9B59B6');
      gradient.addColorStop(0.5, '#E91E63');
      gradient.addColorStop(1, '#9B59B6');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 110, 0, Math.PI * 2);
      ctx.stroke();

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
