/**
 * File: refresh-commands.js
 * Author: Wildflover
 * Description: Force refresh Discord slash commands for immediate update
 * Language: JavaScript (Node.js)
 * Usage: node refresh-commands.js
 */

const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const commandDefinitions = require('./src/commands/definitions');

const commands = [
  commandDefinitions.ping.toJSON(),
  commandDefinitions.info.toJSON(),
  commandDefinitions.config.toJSON(),
  commandDefinitions.tutorial.toJSON(),
  commandDefinitions.help.toJSON(),
  commandDefinitions.setwelcome.toJSON()
];

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('[COMMAND-REFRESH] Started refreshing application (/) commands.');

    // Delete all global commands first
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: [] }
    );
    console.log('[COMMAND-REFRESH] Cleared all global commands.');

    // Register commands globally
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );

    console.log(`[COMMAND-REFRESH] Successfully reloaded ${data.length} application (/) commands.`);
    console.log('[COMMAND-REFRESH] Commands registered:');
    data.forEach(cmd => console.log(`  - /${cmd.name}`));
    console.log('[COMMAND-REFRESH] Note: Global commands may take up to 1 hour to update in Discord.');
    console.log('[COMMAND-REFRESH] For instant update, restart your Discord client or wait a few minutes.');
  } catch (error) {
    console.error('[COMMAND-REFRESH] Error:', error);
  }
})();
