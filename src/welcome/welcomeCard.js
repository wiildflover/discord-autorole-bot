/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator with text rendering fix
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
      
      // Register system fonts explicitly
      try {
        GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 'DejaVu Sans Bold');
        GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'DejaVu Sans');
        logger.info('WELCOME-CARD', 'Fonts registered successfully');
      } catch (fontError) {
        logger.warn('WELCOME-CARD', `Font registration failed: ${fontError.message}`);
      }
      
      const canvas = createCanvas(1024, 450);
      const ctx = canvas.getContext('2d');

      // Load and draw background
      logger.info('WELCOME-CARD', 'Loading background image');
      const background = await loadImage(BACKGROUND_URL);
      ctx.drawImage(background, 0, 0, 1024, 450);

      // Apply dark overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 1024, 450);
      logger.info('WELCOME-CARD', 'Applied dark overlay');

      // Draw title text - WELCOME/GOODBYE
      const messageText = type === 'welcome' ? 'WELCOME' : 'GOODBYE';
      
      ctx.save();
      ctx.font = 'bold 70px "DejaVu Sans Bold", Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const metrics = ctx.measureText(messageText);
      logger.info('WELCOME-CARD', `Text metrics - width: ${metrics.width}, font: ${ctx.font}`);
      
      // Draw with shadow for visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(messageText, 512, 80);
      ctx.restore();
      
      logger.info('WELCOME-CARD', `Title text rendered: ${messageText}`);

      // Load and draw avatar
      const avatarX = 512;
      const avatarY = 180;

      logger.info('WELCOME-CARD', 'Loading avatar');
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

      logger.info('WELCOME-CARD', 'Avatar rendered with gradient border');

      // Draw username below avatar
      ctx.save();
      ctx.font = 'bold 42px "DejaVu Sans Bold", Arial, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(member.user.username, 512, 300);
      ctx.restore();
      
      logger.info('WELCOME-CARD', `Username rendered: ${member.user.username}`);

      // Draw welcome message
      const subText = type === 'welcome' 
        ? 'Welcome to Wildflover Community!' 
        : 'Thanks for being part of our community!';
      
      ctx.save();
      ctx.font = '26px "DejaVu Sans", Arial, sans-serif';
      ctx.fillStyle = '#E0E0E0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 6;
      
      ctx.fillText(subText, 512, 350);
      ctx.restore();
      
      logger.info('WELCOME-CARD', `Subtitle rendered: ${subText}`);

      // Draw member count
      const memberCount = type === 'welcome' 
        ? `Member #${member.guild.memberCount}` 
        : 'We hope to see you again';
      
      ctx.save();
      ctx.font = '22px "DejaVu Sans", Arial, sans-serif';
      ctx.fillStyle = '#AAAAAA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      
      ctx.fillText(memberCount, 512, 390);
      ctx.restore();
      
      logger.info('WELCOME-CARD', `Member count rendered: ${memberCount}`);

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
