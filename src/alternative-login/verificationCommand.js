/**
 * File: verificationCommand.js
 * Author: Wildflover
 * Description: Handles /authlogin setup command - Simple verification without OAuth
 *              Users click button, bot marks them as verified
 * Language: JavaScript (Discord.js)
 */

const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const logger = require('../utils/logger');
const { createVerificationEmbed } = require('./verificationEmbed');

/**
 * In-memory verified users storage
 * Structure: { userId: { verified: true, timestamp: Date.now(), username: string } }
 */
const verifiedUsers = new Map();

/**
 * Handle /authlogin setup command
 * @param {CommandInteraction} interaction - Discord interaction object
 */
async function handleAuthLoginSetup(interaction) {
  try {
    logger.info('AUTHLOGIN-SETUP', `Setup requested by ${interaction.user.tag}`);
    
    // [EMBED] Create verification embed
    const { embed } = createVerificationEmbed(null, null);
    
    // [BUTTON] Create persistent verification button
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('auth_verify')
          .setLabel('Get Verified')
          .setStyle(ButtonStyle.Success)
          .setEmoji('✅')
      );
    
    // [ATTACHMENT] Load verified banner image
    const bannerPath = path.join(__dirname, '../../verified_banner.png');
    const attachment = new AttachmentBuilder(bannerPath, { name: 'verified_banner.png' });
    
    // [SEND] Send verification panel to channel
    await interaction.channel.send({
      embeds: [embed],
      components: [row],
      files: [attachment]
    });
    
    // [CONFIRM] Notify admin
    await interaction.reply({
      content: 'Authentication panel has been set up successfully!',
      ephemeral: true
    });
    
    logger.info('AUTHLOGIN-SETUP', `Panel created in channel ${interaction.channel.id}`);
    
  } catch (error) {
    logger.error('AUTHLOGIN-SETUP', `Setup error: ${error.message}`);
    
    await interaction.reply({
      content: 'An error occurred while setting up the authentication panel.',
      ephemeral: true
    }).catch(() => {});
  }
}

/**
 * Handle verification button click
 * @param {ButtonInteraction} interaction - Discord button interaction
 */
async function handleVerifyButton(interaction) {
  try {
    logger.info('AUTHLOGIN-BUTTON', `Button clicked by ${interaction.user.tag}`);
    
    const userId = interaction.user.id;
    const username = interaction.user.username;
    const discriminator = interaction.user.discriminator;
    const avatar = interaction.user.avatar;
    
    // [VERIFY] Mark user as verified
    verifiedUsers.set(userId, {
      verified: true,
      timestamp: Date.now(),
      username: username,
      discriminator: discriminator,
      avatar: avatar,
      globalName: interaction.user.globalName || username
    });
    
    logger.success('AUTHLOGIN-VERIFY', `User ${username} verified successfully`);
    
    // [RESPONSE] Send success message
    await interaction.reply({
      embeds: [{
        color: 0x57F287,
        title: 'Verification Successful',
        description: 
          `Welcome **${interaction.user.globalName || username}**!\n\n` +
          'Your account has been verified successfully.\n\n' +
          '**Next Steps:**\n' +
          '1. Open the Wildflover application\n' +
          '2. Click the "Alternative Login" button\n' +
          '3. You will be logged in automatically',
        footer: {
          text: 'Wildflover Community • You can now access the application'
        },
        timestamp: new Date()
      }],
      ephemeral: true
    });
    
    logger.info('AUTHLOGIN-BUTTON', `Success message sent to ${username}`);
    
  } catch (error) {
    logger.error('AUTHLOGIN-BUTTON', `Button error: ${error.message}`);
    
    await interaction.reply({
      content: 'An error occurred. Please try again later.',
      ephemeral: true
    }).catch(() => {});
  }
}

/**
 * Check if user is verified
 * @param {string} userId - Discord user ID
 * @returns {Object|null} User verification data or null
 */
function isUserVerified(userId) {
  return verifiedUsers.get(userId) || null;
}

/**
 * Get all verified users
 * @returns {Map} Verified users map
 */
function getVerifiedUsers() {
  return verifiedUsers;
}

/**
 * Clear user verification
 * @param {string} userId - Discord user ID
 */
function clearUserVerification(userId) {
  verifiedUsers.delete(userId);
  logger.info('AUTHLOGIN-CLEAR', `Verification cleared for user ${userId}`);
}

module.exports = {
  handleAuthLoginSetup,
  handleVerifyButton,
  isUserVerified,
  getVerifiedUsers,
  clearUserVerification
};
