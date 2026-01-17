/**
 * File: logger.js
 * Author: Wildflover
 * Description: Professional logging utility with color-coded output and timestamp support
 * Language: JavaScript (Node.js)
 */

const chalk = require('chalk');

class Logger {
  constructor() {
    this.colors = {
      info: chalk.cyan,
      success: chalk.green,
      warn: chalk.yellow,
      error: chalk.red,
      debug: chalk.magenta
    };
  }

  getTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  formatMessage(level, tag, message) {
    const timestamp = chalk.gray(`[${this.getTimestamp()}]`);
    const coloredTag = this.colors[level](`[${tag}]`);
    return `${timestamp} ${coloredTag} ${message}`;
  }

  info(tag, message) {
    console.log(this.formatMessage('info', tag, message));
  }

  success(tag, message) {
    console.log(this.formatMessage('success', tag, message));
  }

  warn(tag, message) {
    console.log(this.formatMessage('warn', tag, message));
  }

  error(tag, message) {
    console.error(this.formatMessage('error', tag, message));
  }

  debug(tag, message) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('debug', tag, message));
    }
  }
}

module.exports = new Logger();
