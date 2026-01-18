/**
 * File: tutorials.js
 * Author: Wildflover
 * Description: Comprehensive tutorial system for Wildflover Skin Manager application
 * Language: JavaScript (Node.js)
 */

const { EmbedBuilder } = require('discord.js');

const TUTORIAL_BASE_URL = 'https://raw.githubusercontent.com/wiildflover/wildflover/main/public/assets/learning';

class TutorialSystem {
  static getMainMenu() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Wildflover Skin Manager - Complete Guide')
      .setDescription('Professional League of Legends skin customization tool')
      .addFields(
        { name: '▸ Getting Started', value: 'Use `/tutorial home` to learn the basics', inline: false },
        { name: '▸ Champions Library', value: 'Use `/tutorial champions` to browse and select skins', inline: false },
        { name: '▸ Marketplace', value: 'Use `/tutorial marketplace` to download community mods', inline: false },
        { name: '▸ Custom Skins', value: 'Use `/tutorial customs` to import your own skins', inline: false },
        { name: '▸ Activation System', value: 'Use `/tutorial activate` to enable your skins', inline: false },
        { name: '▸ Settings', value: 'Use `/tutorial settings` for configuration options', inline: false }
      )
      .setFooter({ text: 'Crafted by Wildflover with passion & caffeine' })
      .setTimestamp();
  }

  static getHomeTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Home Screen - Dashboard Overview')
      .setDescription('Your central hub for managing League of Legends skins')
      .addFields(
        { 
          name: '▸ Quick Access Panel', 
          value: 'Navigate between Champions Library, Marketplace, Customs, and Settings from the main menu', 
          inline: false 
        },
        { 
          name: '▸ Active Skins Counter', 
          value: 'View how many skins are currently enabled in your game', 
          inline: false 
        },
        { 
          name: '▸ Recent Activity', 
          value: 'See your latest downloads and activated skins', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/home_preview.png`)
      .setFooter({ text: 'Tip: Use the sidebar for quick navigation' });
  }

  static getChampionsTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Champions Library - Browse & Select Skins')
      .setDescription('Access all League of Legends champions and their available skins')
      .addFields(
        { 
          name: '▸ Step 1: Select Champion', 
          value: 'Click on any champion card to view their available skins', 
          inline: false 
        },
        { 
          name: '▸ Step 2: Browse Skins', 
          value: 'Scroll through official skins, chromas, and custom variants', 
          inline: false 
        },
        { 
          name: '▸ Step 3: Preview', 
          value: 'Click on a skin to see detailed preview and information', 
          inline: false 
        },
        { 
          name: '▸ Step 4: Add to Selection', 
          value: 'Click "Add to Selected Skins" button to queue for activation', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/championslibrary_preview.png`)
      .setFooter({ text: 'Tip: Use search bar to quickly find champions' });
  }

  static getSkinPageTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Skin Details Page - In-Depth View')
      .setDescription('Detailed information about selected skin')
      .addFields(
        { 
          name: '▸ Skin Preview', 
          value: 'High-quality splash art and in-game model preview', 
          inline: false 
        },
        { 
          name: '▸ Chroma Variants', 
          value: 'Browse available color variations for the skin', 
          inline: false 
        },
        { 
          name: '▸ Rarity Information', 
          value: 'View skin tier: Ultimate, Legendary, Epic, or Standard', 
          inline: false 
        },
        { 
          name: '▸ Quick Actions', 
          value: 'Add to favorites, share, or add to selected skins directly', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/skinpage_preview.png`)
      .setFooter({ text: 'Tip: Click chroma icons to preview color variants' });
  }

  static getChromaTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Chroma System - Color Customization')
      .setDescription('Apply unique color variations to your skins')
      .addFields(
        { 
          name: '▸ What are Chromas?', 
          value: 'Alternative color schemes for existing skins, offering visual variety', 
          inline: false 
        },
        { 
          name: '▸ How to Apply', 
          value: '1. Select a skin with chroma support\n2. Click on desired chroma variant\n3. Add to selected skins\n4. Activate normally', 
          inline: false 
        },
        { 
          name: '▸ Compatibility', 
          value: 'Only one chroma can be active per skin at a time', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/chroma_preview.png`)
      .setFooter({ text: 'Tip: Chromas work with both official and custom skins' });
  }

  static getMarketplaceTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Marketplace - Community Mods Hub')
      .setDescription('Download and install community-created custom skins')
      .addFields(
        { 
          name: '▸ Step 1: Browse Marketplace', 
          value: 'Explore thousands of custom skins created by the community', 
          inline: false 
        },
        { 
          name: '▸ Step 2: Filter & Search', 
          value: 'Use filters to find skins by champion, category, or popularity', 
          inline: false 
        },
        { 
          name: '▸ Step 3: Download', 
          value: 'Click "Download" button on any mod card to install', 
          inline: false 
        },
        { 
          name: '▸ Step 4: Auto-Import', 
          value: 'Downloaded mods automatically appear in your Customs library', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/marketplace_preview.png`)
      .setFooter({ text: 'Tip: Check ratings and reviews before downloading' });
  }

  static getMarketplaceFilterTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Marketplace Filters - Advanced Search')
      .setDescription('Refine your search to find exactly what you need')
      .addFields(
        { 
          name: '▸ Champion Filter', 
          value: 'Show only skins for specific champions', 
          inline: false 
        },
        { 
          name: '▸ Category Filter', 
          value: 'Filter by: Anime, Fantasy, Realistic, Meme, Crossover', 
          inline: false 
        },
        { 
          name: '▸ Sort Options', 
          value: 'Sort by: Most Downloaded, Highest Rated, Newest, Trending', 
          inline: false 
        },
        { 
          name: '▸ Quality Filter', 
          value: 'Filter by skin quality: High, Medium, Standard', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/marketplace_filtre_preview.png`)
      .setFooter({ text: 'Tip: Combine multiple filters for precise results' });
  }

  static getDownloadHistoryTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Download History - Track Your Mods')
      .setDescription('View and manage all your downloaded marketplace mods')
      .addFields(
        { 
          name: '▸ Download Log', 
          value: 'Complete history of all marketplace downloads with timestamps', 
          inline: false 
        },
        { 
          name: '▸ Quick Actions', 
          value: 'Re-download, delete, or activate directly from history', 
          inline: false 
        },
        { 
          name: '▸ Storage Management', 
          value: 'View total storage used by downloaded mods', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/downloadhistory_preview.png`)
      .setFooter({ text: 'Tip: Clear old downloads to free up space' });
  }

  static getCustomsTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Custom Skins - Import Your Own Mods')
      .setDescription('Add custom skins from external sources')
      .addFields(
        { 
          name: '▸ Step 1: Obtain Custom Skin', 
          value: 'Download .fantome or .zip skin files from trusted sources', 
          inline: false 
        },
        { 
          name: '▸ Step 2: Import to Wildflover', 
          value: 'Click "Import Custom" button and select your skin file', 
          inline: false 
        },
        { 
          name: '▸ Step 3: Verify Import', 
          value: 'Skin appears in Customs library with preview thumbnail', 
          inline: false 
        },
        { 
          name: '▸ Step 4: Activate', 
          value: 'Add to selected skins and activate like any other skin', 
          inline: false 
        },
        { 
          name: '▸ Supported Formats', 
          value: '.fantome, .zip (must contain valid skin structure)', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/customs_preview.png`)
      .setFooter({ text: 'Warning: Only use skins from trusted sources' });
  }

  static getActivationTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Activation System - Enable Your Skins')
      .setDescription('How to activate and apply skins to your League of Legends game')
      .addFields(
        { 
          name: '▸ Step 1: Select Skins', 
          value: 'Add desired skins to "Selected Skins" list from any source', 
          inline: false 
        },
        { 
          name: '▸ Step 2: Open Selected Skins', 
          value: 'Click "Selected Skins" button (shows count badge)', 
          inline: false 
        },
        { 
          name: '▸ Step 3: Review Selection', 
          value: 'Verify all skins in the list are correct, remove unwanted ones', 
          inline: false 
        },
        { 
          name: '▸ Step 4: Click Activate', 
          value: 'Press the green "Activate All" button to apply skins', 
          inline: false 
        },
        { 
          name: '▸ Step 5: Wait for Process', 
          value: 'Activation progress bar shows real-time status', 
          inline: false 
        },
        { 
          name: '▸ Step 6: Launch Game', 
          value: 'Start League of Legends - skins are now active in-game', 
          inline: false 
        },
        { 
          name: '▸ Important Notes', 
          value: '• Close League of Legends before activating\n• Activation takes 10-30 seconds\n• Skins persist until deactivated', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/selectedskins_preview.png`)
      .setFooter({ text: 'Tip: You can activate multiple skins at once' });
  }

  static getSettingsTutorial() {
    return new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Settings - Configuration Options')
      .setDescription('Customize Wildflover to your preferences')
      .addFields(
        { 
          name: '▸ General Settings', 
          value: 'Language, theme, startup behavior, update preferences', 
          inline: false 
        },
        { 
          name: '▸ Game Integration', 
          value: 'League of Legends installation path, auto-detect game', 
          inline: false 
        },
        { 
          name: '▸ Performance', 
          value: 'Enable/disable animations, optimize for low-end systems', 
          inline: false 
        },
        { 
          name: '▸ Storage Management', 
          value: 'Clear cache, manage downloaded files, backup settings', 
          inline: false 
        },
        { 
          name: '▸ About & Updates', 
          value: 'Version information, check for updates, changelog', 
          inline: false 
        }
      )
      .setImage(`${TUTORIAL_BASE_URL}/settings_preview.png`)
      .setFooter({ text: 'Tip: Backup your settings before major updates' });
  }

  static getTroubleshooting() {
    return new EmbedBuilder()
      .setColor(0xFF5555)
      .setTitle('Troubleshooting - Common Issues')
      .setDescription('Solutions to frequently encountered problems')
      .addFields(
        { 
          name: '▸ Skins Not Showing In-Game', 
          value: '1. Ensure League is closed during activation\n2. Verify game path in settings\n3. Re-activate skins\n4. Restart League of Legends', 
          inline: false 
        },
        { 
          name: '▸ Activation Failed', 
          value: '1. Run Wildflover as Administrator\n2. Disable antivirus temporarily\n3. Check game file integrity\n4. Reinstall Wildflover', 
          inline: false 
        },
        { 
          name: '▸ Custom Skin Import Error', 
          value: '1. Verify file format (.fantome or .zip)\n2. Check file isn\'t corrupted\n3. Ensure skin is compatible with current patch', 
          inline: false 
        },
        { 
          name: '▸ Marketplace Download Issues', 
          value: '1. Check internet connection\n2. Clear download cache\n3. Try different mod\n4. Report broken mod to community', 
          inline: false 
        }
      )
      .setFooter({ text: 'Still having issues? Join our Discord support server' });
  }
}

module.exports = TutorialSystem;
