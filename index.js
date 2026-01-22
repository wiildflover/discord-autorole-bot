/**
 * File: index.js
 * Author: Wildflover
 * Description: Entry point for Discord bot application with error handling and graceful shutdown
 * Language: JavaScript (Node.js)
 */

require('dotenv').config();
const AutoRoleBot = require('./src/bot');
const logger = require('./src/utils/logger');
const chalk = require('chalk');

const PROJECT_INFO = {
  name: 'Discord Auto-Role Bot',
  author: 'Wildflover',
  version: '2.0.0',
  description: 'Advanced automation system with role assignment and ticket support',
  features: [
    'Mention-based role assignment',
    'Automatic reaction confirmation',
    'Professional ticket system',
    'Welcome card generator',
    'Multi-language tutorial system',
    'Timed message deletion',
    'Professional logging system',
    'Error handling and recovery'
  ],
  environment: process.env.NODE_ENV || 'production'
};

function displayProjectInfo() {
  console.log('\n' + '='.repeat(80));
  logger.info('PROJECT-INFO', `${PROJECT_INFO.name} v${PROJECT_INFO.version}`);
  logger.info('PROJECT-INFO', `Author: ${PROJECT_INFO.author}`);
  logger.info('PROJECT-INFO', `Description: ${PROJECT_INFO.description}`);
  logger.info('PROJECT-INFO', `Environment: ${PROJECT_INFO.environment}`);
  
  console.log('\n' + chalk.cyan('[FEATURES]'));
  PROJECT_INFO.features.forEach((feature, index) => {
    console.log(chalk.gray(`  ${index + 1}. ${feature}`));
  });
  console.log('='.repeat(80) + '\n');
}

function setupProcessHandlers(bot) {
  process.on('unhandledRejection', (error) => {
    logger.error('UNHANDLED-REJECTION', error.message);
  });

  process.on('uncaughtException', (error) => {
    logger.error('UNCAUGHT-EXCEPTION', error.message);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    logger.warn('SHUTDOWN', 'Received SIGINT signal, shutting down gracefully');
    bot.client.destroy();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    logger.warn('SHUTDOWN', 'Received SIGTERM signal, shutting down gracefully');
    bot.client.destroy();
    process.exit(0);
  });
}

function main() {
  displayProjectInfo();
  
  logger.info('INITIALIZATION', 'Starting bot initialization sequence');
  
  const bot = new AutoRoleBot();
  setupProcessHandlers(bot);
  
  bot.start();
}

main();
