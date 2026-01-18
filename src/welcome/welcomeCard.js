/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with custom background and avatar
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Starting card generation for ${member.user.tag}`);
      
      const WIDTH = 1024;
      const HEIGHT = 450;
      const canvas = createCanvas(WIDTH, HEIGHT);
      const ctx = canvas.getContext('2d');

      logger.info('WELCOME-CARD', 'Loading background image');
      const background = await loadImage(BACKGROUND_URL);
      ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      logger.info('WELCOME-CARD', 'Drawing avatar first');
      const avatarSize = 150;
      const avatarX = WIDTH / 2;
      const avatarY = 180;

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );

      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2, true);
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
      ctx.arc(avatarX, avatarY, avatarSize / 2 + 5, 0, Math.PI * 2, true);
      ctx.stroke();

      logger.info('WELCOME-CARD', 'Drawing all text elements');
      
      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      const username = member.user.username;
      const subText = type === 'welcome' 
        ? 'Welcome to Wildflover Community!' 
        : 'Thanks for being part of our community!';
      const memberCount = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again';

      this.drawText(ctx, messageText, WIDTH / 2, 50, 'bold 70px sans-serif', '#FFFFFF', '#000000', 8);
      this.drawText(ctx, username, WIDTH / 2, 280, 'bold 42px sans-serif', '#FFFFFF', '#000000', 6);
      this.drawText(ctx, subText, WIDTH / 2, 340, '26px sans-serif', '#E0E0E0', null, 0);
      this.drawText(ctx, memberCount, WIDTH / 2, 380, '22px sans-serif', '#AAAAAA', null, 0);

      logger.info('WELCOME-CARD', 'Creating attachment');
      const buffer = canvas.toBuffer('image/png');
      const attachment = new AttachmentBuilder(buffer, {
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

  static drawText(ctx, text, x, y, font, fillColor, strokeColor, strokeWidth) {
    ctx.save();
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = fillColor;
    
    if (strokeColor && strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text, x, y);
    }
    
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}

module.exports = WelcomeCardGenerator;
