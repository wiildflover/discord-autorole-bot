/**
 * File: verificationCommand.js
 * Author: Wildflover
 * Description: Handles /authlogin setup command and button interactions
 *              Creates persistent verification panel with OAuth button
 * Language: JavaScript (Discord.js)
 */

const { AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const path = require('path');
const logger = require('../utils/logger');
const { generateState } = require('./verificationManager');
const { createVerificationEmbed } = require('./verificationEmbed');

/**
 * Load configuration with Railway environment variables support
 * Priority: Railway environment variables > config.json
 */
const fs = require('fs');
const configPath = path.join(__dirname, '../../config.json');
let config = {};

if (fs.existsSync(configPath)) {
  config = require('../../config.json');
}

/**
 * OAuth configuration from Railway environment variables or config.json
 * Uses CLIENT_ID from Railway variables (same as bot client ID)
 * Default redirect URI points to Tauri application dev server
 */
const OAUTH_CONFIG = {
  clientId: process.env.CLIENT_ID || config.clientId || '',
  redirectUri: process.env.OAUTH_REDIRECT_URI || 'http://localhost:1420/auth/callback',
  scope: 'identify guilds',
  responseType: 'code'
};

/**
 * Build OAuth authorization URL with state
 * @param {string} state - Secure state token
 * @returns {string} Complete OAuth URL
 */
function buildOAuthUrl(state) {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: OAUTH_CONFIG.responseType,
    scope: OAUTH_CONFIG.scope,
    state: state
  });
  
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

/**
 * Handle /authlogin setup command
 * @param {CommandInteraction} interaction - Discord interaction object
 */
async function handleAuthLoginSetup(interaction) {
  try {
    logger.info('AUTHLOGIN-SETUP', `Setup requested by ${interaction.user.tag}`);
    
    // [VALIDATION] Check if OAuth is configured
    if (!OAUTH_CONFIG.clientId) {
      logger.error('AUTHLOGIN-SETUP', 'OAuth client ID not configured');
      await interaction.reply({
        content: '❌ Authentication system is not configured. CLIENT_ID is missing in Railway environment variables.',
        ephemeral: true
      });
      return;
    }
    
    if (!OAUTH_CONFIG.redirectUri || OAUTH_CONFIG.redirectUri === 'http://localhost:1420/auth/callback') {
      logger.info('AUTHLOGIN-SETUP', 'Using Tauri dev server redirect URI');
    }
    
    logger.info('AUTHLOGIN-SETUP', `Using client ID: ${OAUTH_CONFIG.clientId.substring(0, 8)}...`);
    logger.info('AUTHLOGIN-SETUP', `Redirect URI: ${OAUTH_CONFIG.redirectUri}`);
    
    // [EMBED] Create verification embed (without state, will be generated on button click)
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
      content: '✅ Authentication panel has been set up successfully!',
      ephemeral: true
    });
    
    logger.info('AUTHLOGIN-SETUP', `Panel created in channel ${interaction.channel.id}`);
    
  } catch (error) {
    logger.error('AUTHLOGIN-SETUP', `Setup error: ${error.message}`);
    
    await interaction.reply({
      content: '❌ An error occurred while setting up the authentication panel.',
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
    
    // [STATE] Generate secure state token
    const state = generateState(interaction.user.id);
    
    // [URL] Build OAuth authorization URL
    const authUrl = buildOAuthUrl(state);
    
    // [RESPONSE] Send ephemeral message with OAuth link
    await interaction.reply({
      content: 
        '**Application Access Verification**\n\n' +
        'Click the button below to verify your account and gain access to Wildflover application.\n\n' +
        '⚠️ This link is personal and expires in 10 minutes.',
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('Verify Account')
              .setStyle(ButtonStyle.Link)
              .setURL(authUrl)
              .setEmoji('🔐')
          )
      ],
      ephemeral: true
    });
    
    logger.info('AUTHLOGIN-BUTTON', `OAuth link sent to ${interaction.user.tag}`);
    
  } catch (error) {
    logger.error('AUTHLOGIN-BUTTON', `Button error: ${error.message}`);
    
    await interaction.reply({
      content: '❌ An error occurred. Please try again later.',
      ephemeral: true
    }).catch(() => {});
  }
}

module.exports = {
  handleAuthLoginSetup,
  handleVerifyButton,
  buildOAuthUrl
};
