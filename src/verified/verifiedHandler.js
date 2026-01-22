/**
 * File: verifiedHandler.js
 * Author: Wildflover
 * Description: Handler for verified role button interactions
 * Language: JavaScript (Node.js)
 */

const { PermissionFlagsBits } = require('discord.js');
const logger = require('../utils/logger');
const VerifiedEmbed = require('./verifiedEmbed');

class VerifiedHandler {
  constructor(client, config) {
    this.client = client;
    this.config = config;
  }

  async handleVerificationButton(interaction) {
    try {
      const member = interaction.member;
      const guild = interaction.guild;
      const roleId = this.config.roleId;

      if (!roleId) {
        logger.error('VERIFIED-HANDLER', 'Role ID not configured');
        return await interaction.reply({
          content: 'Verification system is not properly configured. Please contact an administrator.',
          ephemeral: true
        });
      }

      const role = guild.roles.cache.get(roleId);
      
      if (!role) {
        logger.error('VERIFIED-HANDLER', `Role not found: ${roleId}`);
        return await interaction.reply({
          content: 'Verification role not found. Please contact an administrator.',
          ephemeral: true
        });
      }

      // Check if user already has the role
      if (member.roles.cache.has(roleId)) {
        logger.info('VERIFIED-HANDLER', `${member.user.tag} already has verified role`);
        const alreadyVerifiedEmbed = VerifiedEmbed.createAlreadyVerifiedEmbed(member);
        return await interaction.reply({
          embeds: [alreadyVerifiedEmbed],
          ephemeral: true
        });
      }

      // Check bot permissions
      if (!guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        logger.error('VERIFIED-HANDLER', 'Bot lacks MANAGE_ROLES permission');
        return await interaction.reply({
          content: 'Bot does not have permission to manage roles.',
          ephemeral: true
        });
      }

      // Check role hierarchy
      const botRole = guild.members.me.roles.highest;
      if (botRole.position <= role.position) {
        logger.error('VERIFIED-HANDLER', `Role hierarchy issue: bot(${botRole.position}) <= target(${role.position})`);
        return await interaction.reply({
          content: 'Bot role position is too low to assign this role.',
          ephemeral: true
        });
      }

      // Assign role
      await member.roles.add(role);
      logger.success('VERIFIED-HANDLER', `Verified role assigned to ${member.user.tag}`);

      // Send success message
      const successEmbed = VerifiedEmbed.createSuccessEmbed(member);
      await interaction.reply({
        embeds: [successEmbed],
        ephemeral: true
      });

    } catch (error) {
      logger.error('VERIFIED-HANDLER', `Error handling verification: ${error.message}`);
      
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'An error occurred during verification. Please try again later.',
          ephemeral: true
        });
      }
    }
  }
}

module.exports = VerifiedHandler;
