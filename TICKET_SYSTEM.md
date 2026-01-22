# Ticket System Documentation
**Author:** Wildflover  
**Version:** 2.0.0  
**Language:** Markdown

## System Overview

Modern ve profesyonel ticket destek sistemi. Discord sunucunuzda kullanıcıların özel destek kanalları oluşturmasını sağlar.

## Architecture

```
src/ticket/
├── ticketConfig.js      → Sistem konfigürasyonu ve kategori tanımları
├── ticketStorage.js     → JSON tabanlı veritabanı yönetimi
├── ticketEmbed.js       → Profesyonel embed tasarımları
├── ticketButtons.js     → Button component'leri ve action rows
├── ticketModal.js       → Modal form sistemleri
├── ticketManager.js     → Ana ticket yönetim sistemi
└── ticketHandler.js     → Interaction handler'ları
```

## Features

### Core Functionality
- Kategori bazlı ticket oluşturma (Technical, Payment, Account, Other)
- Otomatik özel kanal oluşturma
- Permission yönetimi (kullanıcı + staff)
- Ticket claim sistemi
- Transcript oluşturma
- Otomatik kanal silme
- Ticket istatistikleri

### Security
- Admin-only setup komutları
- Permission kontrolü
- Kullanıcı başına maksimum ticket limiti
- Staff-only claim ve close işlemleri

### Data Management
- JSON tabanlı persistent storage
- Otomatik backup sistemi
- Ticket geçmişi saklama
- İstatistik toplama

## Installation

### 1. Sistem Gereksinimleri
- Node.js v18.0.0 veya üzeri
- Discord.js v14.14.1
- Yeterli bot permissions

### 2. Bot Permissions
Bot'un aşağıdaki izinlere sahip olması gerekir:
- Manage Channels
- Manage Roles
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Add Reactions

### 3. Kurulum Adımları

```bash
# Dependencies yüklendi (zaten mevcut)
npm install

# Bot'u başlat
npm start
```

## Usage

### Admin Commands

#### Ticket Panel Oluşturma
```
/ticket setup
```
Mevcut kanalda ticket panelini oluşturur. Kullanıcılar bu panelden ticket açabilir.

#### Ticket İstatistikleri
```
/ticket stats
```
Toplam, açık, bekleyen ve kapalı ticket sayılarını gösterir.

#### Ticket Kapatma (Force)
```
/ticket close
```
Mevcut ticket kanalını zorla kapatır (sadece ticket kanallarında çalışır).

### User Workflow

1. Kullanıcı ticket panelinde "Create Ticket" butonuna tıklar
2. Kategori seçer (Technical, Payment, Account, Other)
3. Modal formda sorununu detaylı açıklar
4. Otomatik olarak özel kanal oluşturulur
5. Staff bildirim alır ve yanıt verir
6. Sorun çözüldüğünde ticket kapatılır
7. Kanal 10 saniye sonra otomatik silinir

### Staff Actions

#### Ticket Claim
- "Claim" butonuna tıklayarak ticket'ı sahiplenin
- Kullanıcıya bildirim gönderilir

#### Ticket Close
- "Close Ticket" butonuna tıklayın
- Onay verin
- Kanal otomatik silinir

#### Transcript
- "Transcript" butonuna tıklayın
- Tüm mesaj geçmişi .txt dosyası olarak indirilir

## Configuration

### Ticket Categories

`src/ticket/ticketConfig.js` dosyasından kategorileri özelleştirebilirsiniz:

```javascript
categories: {
  technical: {
    emoji: '🔧',
    label: 'Technical Support',
    description: 'Launcher / Skins not working',
    color: 0xE74C3C,
    channelPrefix: 'tech-support'
  }
  // Daha fazla kategori eklenebilir
}
```

### System Settings

```javascript
settings: {
  maxTicketsPerUser: 3,                    // Kullanıcı başına max ticket
  autoCloseInactiveAfter: 7 * 24 * 60 * 60 * 1000,  // 7 gün
  transcriptEnabled: true,                 // Transcript özelliği
  categoryChannelName: 'TICKETS',          // Kategori adı
  logChannelName: 'ticket-logs'            // Log kanalı adı
}
```

### Banner Image

Ticket panelinde gösterilecek banner:
```javascript
bannerImage: 'https://your-image-url.png'
```

## Database Structure

Ticket verileri `data/tickets.json` dosyasında saklanır:

```json
{
  "channel-id": {
    "id": "channel-id",
    "userId": "user-id",
    "username": "user#0000",
    "category": "technical",
    "reason": "Skin not loading",
    "status": "open",
    "createdAt": 1234567890,
    "lastActivity": 1234567890,
    "messages": [],
    "closedAt": null,
    "closedBy": null
  }
}
```

## Troubleshooting

### Ticket Oluşturulamıyor
- Bot'un "Manage Channels" iznine sahip olduğundan emin olun
- Bot rolünün yeterince yüksek olduğunu kontrol edin
- TICKETS kategorisi manuel oluşturulmuşsa silin, bot otomatik oluşturacak

### Kanal Silinmiyor
- Bot'un "Manage Channels" iznini kontrol edin
- Console loglarını inceleyin

### Transcript Çalışmıyor
- Bot'un "Attach Files" iznine sahip olduğundan emin olun
- Mesaj geçmişi okuma iznini kontrol edin

## Advanced Features

### Custom Ticket Categories

Yeni kategori eklemek için `ticketConfig.js` dosyasını düzenleyin:

```javascript
newCategory: {
  emoji: '⚡',
  label: 'Custom Category',
  description: 'Your description',
  color: 0x3498DB,
  channelPrefix: 'custom'
}
```

### Auto-Close Inactive Tickets

Gelecek güncellemelerde eklenecek:
- Belirli süre aktif olmayan ticket'ları otomatik kapat
- Kullanıcıya uyarı mesajı gönder
- İstatistiklere kaydet

### Ticket Priority System

Gelecek güncellemelerde eklenecek:
- Low, Medium, High, Critical öncelik seviyeleri
- Önceliğe göre renk kodlama
- Staff bildirim sistemi

## Support

Sorun yaşıyorsanız:
1. Console loglarını kontrol edin
2. Bot permissions'ları doğrulayın
3. Discord.js versiyonunu kontrol edin (v14.14.1)
4. GitHub Issues'da sorun bildirin

## Credits

**Developer:** Wildflover  
**Framework:** Discord.js v14  
**Architecture:** Modular & Scalable  
**Design:** Modern & Professional
