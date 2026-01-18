/**
 * File: tutorials.js
 * Author: Wildflover
 * Description: Comprehensive tutorial system for Wildflover Skin Manager application
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');
const translations = require('../utils/translations');

const TUTORIAL_BASE_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/learning';

class TutorialSystem {
  static getMainMenu(lang = 'en') {
    const t = translations[lang].mainMenu;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { name: t.gettingStarted, value: t.gettingStartedValue, inline: false },
        { name: t.championsLibrary, value: t.championsLibraryValue, inline: false },
        { name: t.marketplace, value: t.marketplaceValue, inline: false },
        { name: t.customSkins, value: t.customSkinsValue, inline: false },
        { name: t.activationSystem, value: t.activationSystemValue, inline: false },
        { name: t.settings, value: t.settingsValue, inline: false }
      )
      .setFooter({ text: t.footer })
      .setTimestamp();
  }

  static getHomeTutorial(lang = 'en') {
    const t = translations[lang].home;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.quickAccess, 
          value: t.quickAccessValue, 
          inline: false 
        },
        { 
          name: t.activeSkinsCounter, 
          value: t.activeSkinsCounterValue, 
          inline: false 
        },
        { 
          name: t.recentActivity, 
          value: t.recentActivityValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/home_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getChampionsTutorial(lang = 'en') {
    const t = translations[lang].champions;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.step1, 
          value: t.step1Value, 
          inline: false 
        },
        { 
          name: t.step2, 
          value: t.step2Value, 
          inline: false 
        },
        { 
          name: t.step3, 
          value: t.step3Value, 
          inline: false 
        },
        { 
          name: t.step4, 
          value: t.step4Value, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/championslibrary_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getSkinPageTutorial(lang = 'en') {
    const t = translations[lang].skinPage;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.preview, 
          value: t.previewValue, 
          inline: false 
        },
        { 
          name: t.chromaVariants, 
          value: t.chromaVariantsValue, 
          inline: false 
        },
        { 
          name: t.rarity, 
          value: t.rarityValue, 
          inline: false 
        },
        { 
          name: t.quickActions, 
          value: t.quickActionsValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/skinpage_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getChromaTutorial(lang = 'en') {
    const t = translations[lang].chroma;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.whatAre, 
          value: t.whatAreValue, 
          inline: false 
        },
        { 
          name: t.howToApply, 
          value: t.howToApplyValue, 
          inline: false 
        },
        { 
          name: t.compatibility, 
          value: t.compatibilityValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/chroma_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getMarketplaceTutorial(lang = 'en') {
    const t = translations[lang].marketplace;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.step1, 
          value: t.step1Value, 
          inline: false 
        },
        { 
          name: t.step2, 
          value: t.step2Value, 
          inline: false 
        },
        { 
          name: t.step3, 
          value: t.step3Value, 
          inline: false 
        },
        { 
          name: t.step4, 
          value: t.step4Value, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/marketplace_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getMarketplaceFilterTutorial(lang = 'en') {
    const t = translations[lang].filters;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.championFilter, 
          value: t.championFilterValue, 
          inline: false 
        },
        { 
          name: t.categoryFilter, 
          value: t.categoryFilterValue, 
          inline: false 
        },
        { 
          name: t.sortOptions, 
          value: t.sortOptionsValue, 
          inline: false 
        },
        { 
          name: t.qualityFilter, 
          value: t.qualityFilterValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/marketplace_filtre_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getDownloadHistoryTutorial(lang = 'en') {
    const t = translations[lang].history;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.downloadLog, 
          value: t.downloadLogValue, 
          inline: false 
        },
        { 
          name: t.quickActions, 
          value: t.quickActionsValue, 
          inline: false 
        },
        { 
          name: t.storageManagement, 
          value: t.storageManagementValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/downloadhistory_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getCustomsTutorial(lang = 'en') {
    const t = translations[lang].customs;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.step1, 
          value: t.step1Value, 
          inline: false 
        },
        { 
          name: t.step2, 
          value: t.step2Value, 
          inline: false 
        },
        { 
          name: t.step3, 
          value: t.step3Value, 
          inline: false 
        },
        { 
          name: t.step4, 
          value: t.step4Value, 
          inline: false 
        },
        { 
          name: t.supportedFormats, 
          value: t.supportedFormatsValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/customs_preview.png`)
      .setFooter({ text: t.warning });
  }

  static getActivationTutorial(lang = 'en') {
    const t = translations[lang].activate;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.step1, 
          value: t.step1Value, 
          inline: false 
        },
        { 
          name: t.step2, 
          value: t.step2Value, 
          inline: false 
        },
        { 
          name: t.step3, 
          value: t.step3Value, 
          inline: false 
        },
        { 
          name: t.step4, 
          value: t.step4Value, 
          inline: false 
        },
        { 
          name: t.step5, 
          value: t.step5Value, 
          inline: false 
        },
        { 
          name: t.step6, 
          value: t.step6Value, 
          inline: false 
        },
        { 
          name: t.importantNotes, 
          value: t.importantNotesValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/selectedskins_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getSettingsTutorial(lang = 'en') {
    const t = translations[lang].settings;
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.general, 
          value: t.generalValue, 
          inline: false 
        },
        { 
          name: t.gameIntegration, 
          value: t.gameIntegrationValue, 
          inline: false 
        },
        { 
          name: t.performance, 
          value: t.performanceValue, 
          inline: false 
        },
        { 
          name: t.storageManagement, 
          value: t.storageManagementValue, 
          inline: false 
        },
        { 
          name: t.aboutUpdates, 
          value: t.aboutUpdatesValue, 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/settings_preview.png`)
      .setFooter({ text: t.tip });
  }

  static getTroubleshooting(lang = 'en') {
    const t = translations[lang].troubleshoot;
    return new EmbedBuilder()
      .setColor(0xFF5555)
      .setTitle(t.title)
      .setDescription(t.description)
      .addFields(
        { 
          name: t.skinsNotShowing, 
          value: t.skinsNotShowingValue, 
          inline: false 
        },
        { 
          name: t.activationFailed, 
          value: t.activationFailedValue, 
          inline: false 
        },
        { 
          name: t.importError, 
          value: t.importErrorValue, 
          inline: false 
        },
        { 
          name: t.downloadIssues, 
          value: t.downloadIssuesValue, 
          inline: false 
        }
      )
      .setFooter({ text: t.footer });
  }
}

module.exports = TutorialSystem;
