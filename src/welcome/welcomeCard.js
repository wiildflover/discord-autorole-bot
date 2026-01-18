/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with guaranteed text rendering
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

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

      // Draw text BEFORE avatar to ensure it renders
      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      
      // Top text - WELCOME/GOODBYE
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.font = '70px sans-serif';
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(messageText, 512, 80);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(messageText, 512, 80);
      
      logger.info('WELCOME-CARD', `Drew title text: ${messageText}`);

      // Load and draw avatar
      const avatarX = 512;
      const avatarY = 180;

      const avatar = await loadImage(
        member.user.displayAvatarURL({ extension: 'png', size: 256 })
      );

      // Draw avatar with clipping
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 75, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, avatarX - 75, avatarY - 75, 150, 150);
      ctx.restore();

      // Draw gradient border around avatar
      const gradient = ctx.createLinearGradient(avatarX - 80, avatarY - 80, avatarX + 80, avatarY + 80);
      gradient.addColorStop(0, '#9B59B6');
      gradient.addColorStop(0.5, '#E91E63');
      gradient.addColorStop(1, '#9B59B6');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, 80, 0, Math.PI * 2);
      ctx.stroke();

      logger.info('WELCOME-CARD', 'Drew avatar with gradient border');

      // Draw username below avatar
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.font = '42px sans-serif';
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(member.user.username, 512, 300);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(member.user.username, 512, 300);
      
      logger.info('WELCOME-CARD', `Drew username: ${member.user.username}`);

      // Draw welcome message
      const subText = type === 'welcome' 
        ? 'Welcome to Wildflover Community!' 
        : 'Thanks for being part of our community!';
      
      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#E0E0E0';
      ctx.fillText(subText, 512, 350);
      
      logger.info('WELCOME-CARD', `Drew subtitle: ${subText}`);

      // Draw member count
      const memberCount = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again';
      
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#AAAAAA';
      ctx.fillText(memberCount, 512, 390);
      
      logger.info('WELCOME-CARD', `Drew member count: ${memberCount}`);

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
}

module.exports = WelcomeCardGenerator;
