/**
 * File: setup-github.js
 * Author: Wildflover
 * Description: Automated GitHub repository creation and deployment script
 * Language: JavaScript (Node.js)
 */

const https = require('https');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class GitHubSetup {
  constructor() {
    this.token = null;
    this.username = null;
    this.repoName = 'discord-autorole-bot';
  }

  log(tag, message) {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warn: '\x1b[33m',
      reset: '\x1b[0m'
    };
    console.log(`${colors.info}[${tag}]${colors.reset} ${message}`);
  }

  async prompt(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  async makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  async getUserInfo() {
    this.log('GITHUB-API', 'Fetching user information...');
    
    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'Authorization': `token ${this.token}`,
        'User-Agent': 'Discord-Bot-Setup',
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    const response = await this.makeRequest(options);
    
    if (response.status === 200) {
      this.username = response.data.login;
      this.log('SUCCESS', `Authenticated as: ${this.username}`);
      return true;
    } else {
      this.log('ERROR', 'Invalid GitHub token');
      return false;
    }
  }

  async createRepository() {
    this.log('GITHUB-API', `Creating repository: ${this.repoName}`);
    
    const options = {
      hostname: 'api.github.com',
      path: '/user/repos',
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'User-Agent': 'Discord-Bot-Setup',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };

    const repoData = {
      name: this.repoName,
      description: 'Professional Discord bot with automated role assignment system',
      private: false,
      auto_init: false
    };

    const response = await this.makeRequest(options, repoData);
    
    if (response.status === 201) {
      this.log('SUCCESS', `Repository created: https://github.com/${this.username}/${this.repoName}`);
      return true;
    } else if (response.status === 422) {
      this.log('WARN', 'Repository already exists, continuing...');
      return true;
    } else {
      this.log('ERROR', `Failed to create repository: ${response.data.message || 'Unknown error'}`);
      return false;
    }
  }

  execCommand(command, description) {
    try {
      this.log('GIT-COMMAND', description);
      execSync(command, { stdio: 'inherit' });
      return true;
    } catch (error) {
      this.log('ERROR', `Command failed: ${command}`);
      return false;
    }
  }

  async setupGit() {
    this.log('GIT-SETUP', 'Initializing Git repository...');

    const commands = [
      { cmd: 'git init', desc: 'Initializing Git' },
      { cmd: 'git add .', desc: 'Adding files to staging' },
      { cmd: 'git commit -m "Initial commit: Discord Auto-Role Bot by Wildflover"', desc: 'Creating initial commit' },
      { cmd: 'git branch -M main', desc: 'Setting main branch' }
    ];

    for (const { cmd, desc } of commands) {
      if (!this.execCommand(cmd, desc)) {
        return false;
      }
    }

    try {
      execSync('git remote remove origin', { stdio: 'ignore' });
    } catch (e) {
      // Remote doesn't exist, that's fine
    }

    const remoteUrl = `https://${this.token}@github.com/${this.username}/${this.repoName}.git`;
    if (!this.execCommand(`git remote add origin ${remoteUrl}`, 'Adding remote origin')) {
      return false;
    }

    if (!this.execCommand('git push -u origin main', 'Pushing to GitHub')) {
      return false;
    }

    this.log('SUCCESS', 'Repository successfully pushed to GitHub!');
    return true;
  }

  async run() {
    console.log('\n' + '='.repeat(80));
    this.log('GITHUB-SETUP', 'Discord Bot GitHub Deployment Automation');
    this.log('AUTHOR', 'Wildflover');
    console.log('='.repeat(80) + '\n');

    this.token = await this.prompt('Enter your GitHub Personal Access Token: ');
    
    if (!this.token || this.token.trim() === '') {
      this.log('ERROR', 'Token is required');
      rl.close();
      return;
    }

    this.token = this.token.trim();

    if (!await this.getUserInfo()) {
      rl.close();
      return;
    }

    if (!await this.createRepository()) {
      rl.close();
      return;
    }

    if (!await this.setupGit()) {
      rl.close();
      return;
    }

    console.log('\n' + '='.repeat(80));
    this.log('COMPLETE', 'GitHub setup completed successfully!');
    this.log('REPOSITORY', `https://github.com/${this.username}/${this.repoName}`);
    this.log('NEXT-STEP', 'Deploy to Railway.app using this repository');
    console.log('='.repeat(80) + '\n');

    rl.close();
  }
}

const setup = new GitHubSetup();
setup.run().catch((error) => {
  console.error('[ERROR]', error.message);
  rl.close();
});
