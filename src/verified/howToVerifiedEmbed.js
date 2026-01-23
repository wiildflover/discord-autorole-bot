/**
 * File: howToVerifiedEmbed.js
 * Author: Wildflover
 * Description: Information embed for verification process guide
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');

class HowToVerifiedEmbed {
  static createGuideEmbed() {
    return new EmbedBuilder()
      .setColor(0xF39C12)
      .setAuthor({
        name: 'HOW TO GET VERIFIED',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setImage('https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_banner.png?raw=true')
      .setDescription(
        '**Follow these simple steps to gain full access to Wildflover Community and application features.**'
      )
      .addFields(
        {
          name: '**STEP 1 - LOCATE VERIFICATION CHANNEL**',
          value: 'Navigate to the <#1463954145902854295> channel in the server.',
          inline: false
        },
        {
          name: '**STEP 2 - CLICK THE BUTTON**',
          value: 'Find the verification panel and click the **"Get Verified"** button.',
          inline: false
        },
        {
          name: '**STEP 3 - INSTANT VERIFICATION**',
          value: 'Your role will be assigned automatically within seconds. No waiting required.',
          inline: false
        },
        {
          name: '**WHAT YOU GET**',
          value: '▸ Full access to Wildflover Skin Manager\n▸ Download privileges from marketplace\n▸ Access to exclusive community channels\n▸ Priority support system\n▸ Early access to new features',
          inline: false
        },
        {
          name: '**TROUBLESHOOTING**',
          value: 'If you encounter any issues during verification, please open a support ticket in <#1463806911186206772> and our team will assist you immediately.',
          inline: false
        }
      )
      .setFooter({ 
        text: 'Wildflover Community • Verification Guide',
        iconURL: 'https://github.com/wiildflover/wildflover-discord-bot/blob/main/verified_icon.png?raw=true&v=3'
      })
      .setTimestamp();
  }
}

module.exports = HowToVerifiedEmbed;
