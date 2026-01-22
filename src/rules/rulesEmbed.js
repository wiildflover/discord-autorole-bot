/**
 * File: rulesEmbed.js
 * Author: Wildflover
 * Description: Server rules and disclaimer embed generator
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');

class RulesEmbed {
  static createRulesPanel() {
    return new EmbedBuilder()
      .setColor(0xED4245)
      .setAuthor({
        name: 'SERVER RULES & DISCLAIMER',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setImage('https://github.com/wiildflover/wildflover-discord-bot/blob/main/rules_banner.png?raw=true')
      .setDescription(
        'Wildflover topluluğuna hoş geldiniz. Lütfen aşağıdaki kuralları okuyun.\n\n' +
        '> **Sorumluluk Reddi**\n' +
        '> Wildflover kullanarak tüm riskleri kabul edersiniz. Geliştirici ekip, hesap kısıtlaması veya yasaklanmadan sorumlu değildir.\n\n' +
        '> **Kullanım Riski**\n' +
        '> Uygulama oyun dosyalarını değiştirir ve Riot Games hizmet şartlarına aykırı olabilir. Riskleri anlayarak kullanın.\n\n' +
        '> **Topluluk Kuralları**\n' +
        '> Saygılı olun, spam yapmayın, destek kanallarını doğru kullanın.\n\n' +
        'Topluluğumuza katıldığınız için teşekkürler.\n\n' +
        '**ENGLISH**\n\n' +
        'Welcome to Wildflover community. Please read the rules below.\n\n' +
        '> **Disclaimer**\n' +
        '> By using Wildflover, you accept all risks. The development team is not responsible for account restrictions or bans.\n\n' +
        '> **Usage Risk**\n' +
        '> The app modifies game files and may violate Riot Games\' terms of service. Use at your own risk.\n\n' +
        '> **Community Rules**\n' +
        '> Be respectful, no spam, use support channels appropriately.\n\n' +
        'Thank you for joining our community.'
      )
      .setFooter({ 
        text: 'Wildflover Community Rules',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setTimestamp();
  }
}

module.exports = RulesEmbed;
