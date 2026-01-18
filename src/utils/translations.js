/**
 * File: translations.js
 * Author: Wildflover
 * Description: Multi-language translation system for tutorial content
 * Language: JavaScript (Node.js)
 */

const translations = {
  en: {
    mainMenu: {
      title: 'Wildflover Skin Manager - Complete Guide',
      description: 'Professional League of Legends skin customization tool',
      gettingStarted: '▸ Getting Started',
      gettingStartedValue: 'Use `/tutorial home` to learn the basics',
      championsLibrary: '▸ Champions Library',
      championsLibraryValue: 'Use `/tutorial champions` to browse and select skins',
      marketplace: '▸ Marketplace',
      marketplaceValue: 'Use `/tutorial marketplace` to download community mods',
      customSkins: '▸ Custom Skins',
      customSkinsValue: 'Use `/tutorial customs` to import your own skins',
      activationSystem: '▸ Activation System',
      activationSystemValue: 'Use `/tutorial activate` to enable your skins',
      settings: '▸ Settings',
      settingsValue: 'Use `/tutorial settings` for configuration options',
      footer: 'Crafted by Wildflover with passion & caffeine'
    },
    home: {
      title: 'Home Screen - Dashboard Overview',
      description: 'Your central hub for managing League of Legends skins',
      quickAccess: '▸ Quick Access Panel',
      quickAccessValue: 'Navigate between Champions Library, Marketplace, Customs, and Settings from the main menu',
      activeSkinsCounter: '▸ Active Skins Counter',
      activeSkinsCounterValue: 'View how many skins are currently enabled in your game',
      recentActivity: '▸ Recent Activity',
      recentActivityValue: 'See your latest downloads and activated skins',
      tip: 'Tip: Use the sidebar for quick navigation'
    }
  },
  tr: {
    mainMenu: {
      title: 'Wildflover Skin Manager - Kapsamlı Rehber',
      description: 'Profesyonel League of Legends kostüm özelleştirme aracı',
      gettingStarted: '▸ Başlangıç',
      gettingStartedValue: 'Temelleri öğrenmek için `/tutorial home` kullanın',
      championsLibrary: '▸ Şampiyon Kütüphanesi',
      championsLibraryValue: 'Kostümlere göz atmak ve seçmek için `/tutorial champions` kullanın',
      marketplace: '▸ Market',
      marketplaceValue: 'Topluluk modlarını indirmek için `/tutorial marketplace` kullanın',
      customSkins: '▸ Özel Kostümler',
      customSkinsValue: 'Kendi kostümlerinizi içe aktarmak için `/tutorial customs` kullanın',
      activationSystem: '▸ Aktifleştirme Sistemi',
      activationSystemValue: 'Kostümlerinizi etkinleştirmek için `/tutorial activate` kullanın',
      settings: '▸ Ayarlar',
      settingsValue: 'Yapılandırma seçenekleri için `/tutorial settings` kullanın',
      footer: 'Wildflover tarafından tutku ve kafeinle hazırlandı'
    },
    home: {
      title: 'Ana Ekran - Kontrol Paneli',
      description: 'League of Legends kostümlerini yönetmek için merkezi merkeziniz',
      quickAccess: '▸ Hızlı Erişim Paneli',
      quickAccessValue: 'Ana menüden Şampiyon Kütüphanesi, Market, Özel Kostümler ve Ayarlar arasında gezinin',
      activeSkinsCounter: '▸ Aktif Kostüm Sayacı',
      activeSkinsCounterValue: 'Oyununuzda şu anda kaç kostümün etkin olduğunu görün',
      recentActivity: '▸ Son Aktivite',
      recentActivityValue: 'En son indirmelerinizi ve etkinleştirdiğiniz kostümleri görün',
      tip: 'İpucu: Hızlı gezinme için kenar çubuğunu kullanın'
    }
  }
};

module.exports = translations;
