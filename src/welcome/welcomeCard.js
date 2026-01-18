/**
 * File: welcomeCard.js
 * Author: Wildflover
 * Description: Welcome/Leave card generator without text rendering (shapes only)
 * Language: JavaScript (Node.js)
 */

const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const logger = require('../utils/logger');

const BACKGROUND_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/backgrounds/wildflover_bg.jpg';

class WelcomeCardGenerator {
  static async generateCard(member, type = 'welcome') {
    try {
      logger.info('WELCOME-CARD', `Generating ${type} card for ${member.user.tag}`);
      
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

      // Load and draw avatar
      const avatarX = 512;
      const avatarY = 225;

      logger.info('WELCOME-CARD', 'Loading avatar');
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

      logger.info('WELCOME-CARD', 'Avatar rendered with gradient border');

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

  static createEmbed(member, type = 'welcome') {
    const embed = new EmbedBuilder()
      .setColor(type === 'welcome' ? 0x9B59B6 : 0x5865F2)
      .setImage(`attachment://${type}-${member.id}.png`);

    if (type === 'welcome') {
      embed
        .setTitle('WELCOME')
        .setDescription(`Welcome to **Wildflover Community**, ${member}!\n\nMember #${member.guild.memberCount}`);
    } else {
      embed
        .setTitle('GOODBYE')
        .setDescription(`${member.user.username} has left the server.\n\nWe hope to see you again!`);
    }

    return embed;
  }
}

module.exports = WelcomeCardGenerator;
