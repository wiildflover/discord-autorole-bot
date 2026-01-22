/**
 * File: welcomeDM.js
 * Author: Wildflover
 * Description: Welcome DM embed generator for new members with server guide
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');

class WelcomeDM {
  static createWelcomeEmbed(member) {
    const embed = new EmbedBuilder()
      .setColor(0x9B59B6)
      .setTitle('Welcome to Wildflover Community!')
      .setImage('https://github.com/wiildflover/discord-autorole-bot/blob/main/welcome_banner.png?raw=true')
      .setDescription(`Hey ${member.user.username}! We're glad to have you here — the largest community for custom League of Legends skins. Before diving in, here are some essentials to get you started:`)
      .addFields(
        {
          name: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
          value: '\u200B',
          inline: false
        },
        {
          name: 'Getting Started',
          value: '**Rules** - <#1459119872284819466> Read this first to keep our community safe\n**News** - <#1459119951678800007> Stay updated with latest announcements\n**Announcements** - <#1463773392279703602> Server updates and new features',
          inline: false
        },
        {
          name: 'Download & Setup',
          value: '**How to Login** - <#1459248874966220991> Step-by-step login guide\n**Download** - <#1459253400234361056> Get the program and setup files\n**GitHub** - <#1460072483641229413> Open-source project and releases',
          inline: false
        },
        {
          name: 'Support & Community',
          value: '**Ticket** - <#1463806911186206772> Get help with program or server issues\n**Verified** - <#1459249995118153873> Get program access approval\n**Customs** - <#1459120564181668008> User-shared custom skins',
          inline: false
        },
        {
          name: '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
          value: '\u200B',
          inline: false
        },
        {
          name: 'Quick Start Guide',
          value: '**Step 1** - Read <#1459119872284819466> to understand community rules\n**Step 2** - Download the program from <#1459253400234361056>\n**Step 3** - Follow login instructions in <#1459248874966220991>\n**Step 4** - Get verified in <#1459249995118153873> for full access\n**Step 5** - Open a <#1463806911186206772> if you need help',
          inline: false
        }
      )
      .setFooter({ 
        text: 'Enjoy your stay! • Wildflover Community'
      })
      .setTimestamp();

    return embed;
  }
}

module.exports = WelcomeDM;
