/**
 * File: verificationEmbed.js
 * Author: Wildflover
 * Description: Creates professional verification embed with OAuth link button
 *              Uses verified_banner.png for visual appeal
 * Language: JavaScript (Discord.js)
 */

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.json');

/**
 * Create verification embed for panel (no OAuth link in embed)
 * @param {string} userId - Discord user ID (optional, not used in panel)
 * @param {string} authUrl - OAuth URL (optional, not used in panel)
 * @returns {Object} Embed for verification panel
 */
function createVerificationEmbed(userId, authUrl) {
  const embed = new EmbedBuilder()
    .setColor(0xFF6B35)
    .setTitle('Application Access Verification')
    .setDescription(
      'Welcome to the Wildflover Community verification system. To gain ' +
      'full access to our custom skin manager application and exclusive ' +
      'features, please complete the verification process by clicking the ' +
      'button below.'
    )
    .addFields(
      {
        name: "What You'll Get:",
        value: 
          '▸ Full access to Wildflover Skin Manager\n' +
          '▸ Exclusive custom skin library\n' +
          '▸ Marketplace download privileges\n' +
          '▸ Community support channels\n' +
          '▸ Early access to new features',
        inline: false
      },
      {
        name: 'Ready to begin?',
        value: 'Click the verification button to proceed.',
        inline: false
      }
    )
    .setImage('attachment://verified_banner.png')
    .setFooter({ 
      text: 'wildflover Community • Verification System',
      iconURL: config.bot?.iconUrl || undefined
    })
    .setTimestamp();

  return { embed };
}

/**
 * Create success confirmation embed after verification
 * @param {Object} user - Discord user object
 * @returns {EmbedBuilder} Success embed
 */
function createSuccessEmbed(user) {
  return new EmbedBuilder()
    .setColor(0x57F287)
    .setTitle('Verification Successful')
    .setDescription(
      `Welcome ${user.username}! Your account has been successfully verified.\n\n` +
      'You now have full access to the Wildflover application. ' +
      'The next time you open the app, you will be automatically logged in.'
    )
    .addFields(
      {
        name: 'Next Steps',
        value: 
          '1. Open Wildflover application\n' +
          '2. Automatic login will occur\n' +
          '3. Start customizing your skins',
        inline: false
      }
    )
    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: 'Thank you for verifying your account' })
    .setTimestamp();
}

/**
 * Create error embed for verification failures
 * @param {string} errorMessage - Error description
 * @returns {EmbedBuilder} Error embed
 */
function createErrorEmbed(errorMessage) {
  return new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle('Verification Failed')
    .setDescription(
      'We encountered an issue during the verification process.\n\n' +
      `**Error:** ${errorMessage}`
    )
    .addFields(
      {
        name: 'What to do?',
        value: 
          '▸ Try the !verify command again\n' +
          '▸ Make sure your DMs are open\n' +
          '▸ Contact support if the issue persists',
        inline: false
      }
    )
    .setFooter({ text: 'Need help? Contact server moderators' })
    .setTimestamp();
}

/**
 * Create info embed about verification system
 * @returns {EmbedBuilder} Info embed
 */
function createInfoEmbed() {
  return new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('About Verification')
    .setDescription(
      'The verification system links your Discord account with the ' +
      'Wildflover application, providing seamless access and exclusive features.'
    )
    .addFields(
      {
        name: 'How it works',
        value: 
          '1. Use the !verify command\n' +
          '2. Click the verification button in DM\n' +
          '3. Authorize the application\n' +
          '4. Your account is linked automatically',
        inline: false
      },
      {
        name: 'Security',
        value: 
          'Your Discord credentials are never shared. We only receive ' +
          'basic profile information needed for verification.',
        inline: false
      },
      {
        name: 'Privacy',
        value: 
          'You can revoke access anytime from Discord User Settings > ' +
          'Authorized Apps.',
        inline: false
      }
    )
    .setFooter({ text: 'Your privacy and security are our priority' })
    .setTimestamp();
}

module.exports = {
  createVerificationEmbed,
  createSuccessEmbed,
  createErrorEmbed,
  createInfoEmbed
};
