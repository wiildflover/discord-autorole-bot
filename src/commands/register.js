/**
 * File: register.js
 * Author: Wildflover
 * Description: Slash command registration system for Discord bot
 * Language: JavaScript (Node.js)
 */

const { REST, Routes } = require('discord.js');
const logger = require('../utils/logger');

class CommandRegistry {
  constructor(token, clientId) {
    this.rest = new REST({ version: '10' }).setToken(token);
    this.clientId = clientId;
    this.commands = [];
  }

  addCommand(command) {
    this.commands.push(command.toJSON());
  }

  async registerGlobally() {
    try {
      logger.info('COMMAND-REGISTER', `Registering ${this.commands.length} slash commands globally`);

      const data = await this.rest.put(
        Routes.applicationCommands(this.clientId),
        { body: this.commands }
      );

      logger.success('COMMAND-REGISTER', `Successfully registered ${data.length} slash commands`);
      return data;
    } catch (error) {
      logger.error('COMMAND-REGISTER', `Failed to register commands: ${error.message}`);
      throw error;
    }
  }

  async registerForGuild(guildId) {
    try {
      logger.info('COMMAND-REGISTER', `Registering ${this.commands.length} slash commands for guild ${guildId}`);

      const data = await this.rest.put(
        Routes.applicationGuildCommands(this.clientId, guildId),
        { body: this.commands }
      );

      logger.success('COMMAND-REGISTER', `Successfully registered ${data.length} slash commands for guild`);
      return data;
    } catch (error) {
      logger.error('COMMAND-REGISTER', `Failed to register guild commands: ${error.message}`);
      throw error;
    }
  }
}

module.exports = CommandRegistry;
