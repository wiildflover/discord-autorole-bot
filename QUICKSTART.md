# Quick Start Guide
**Author:** Wildflover  
**Version:** 2.0.0

## 5 Dakikada Ticket Sistemi Kurulumu

### Adım 1: Bot Hazırlığı

Bot'unuzun çalıştığından ve gerekli izinlere sahip olduğundan emin olun:
- Manage Channels
- Manage Roles
- Send Messages
- Embed Links
- Attach Files

### Adım 2: Ticket Paneli Oluşturma

1. Ticket panelini göstermek istediğiniz kanala gidin
2. Şu komutu çalıştırın:
   ```
   /ticket setup
   ```
3. Bot otomatik olarak profesyonel ticket panelini oluşturacak

### Adım 3: Test Etme

1. "Create Ticket" butonuna tıklayın
2. Bir kategori seçin
3. Modal formda sorununuzu yazın
4. Özel ticket kanalınız oluşturulacak

### Adım 4: Staff Yönetimi

Ticket kanalında:
- **Claim** - Ticket'ı sahiplenin
- **Close Ticket** - Ticket'ı kapatın
- **Transcript** - Mesaj geçmişini indirin

## Özelleştirme

### Kategorileri Değiştirme

`src/ticket/ticketConfig.js` dosyasını düzenleyin:

```javascript
categories: {
  yourCategory: {
    emoji: '⚡',
    label: 'Your Category',
    description: 'Your description',
    color: 0x3498DB,
    channelPrefix: 'your-prefix'
  }
}
```

### Ayarları Değiştirme

```javascript
settings: {
  maxTicketsPerUser: 3,              // Kullanıcı başına max ticket
  categoryChannelName: 'TICKETS',    // Kategori adı
  logChannelName: 'ticket-logs'      // Log kanalı
}
```

### Banner Değiştirme

```javascript
bannerImage: 'https://your-image-url.png'
```

## Sık Sorulan Sorular

### Ticket oluşturulamıyor?
- Bot'un "Manage Channels" iznini kontrol edin
- Bot rolünün yeterince yüksek olduğunu doğrulayın

### Kanal silinmiyor?
- Bot'un "Manage Channels" iznini kontrol edin
- Console loglarını inceleyin

### Staff göremiyorum?
- Support/Staff/Mod rolü oluşturun
- Bot otomatik olarak bu rolleri algılayacak

## İstatistikler

Ticket istatistiklerini görmek için:
```
/ticket stats
```

Bu komut size şunları gösterir:
- Toplam ticket sayısı
- Açık ticket sayısı
- Bekleyen ticket sayısı
- Kapalı ticket sayısı

## Log Kanalı Oluşturma

1. "ticket-logs" adında bir kanal oluşturun
2. Bot otomatik olarak bu kanalı algılayacak
3. Tüm ticket işlemleri burada loglanacak

## Destek

Sorun yaşıyorsanız:
1. `TICKET_SYSTEM.md` dosyasını okuyun
2. Console loglarını kontrol edin
3. Bot permissions'ları doğrulayın

## Sonraki Adımlar

- Log kanalı oluşturun
- Kategorileri özelleştirin
- Staff rollerini ayarlayın
- Banner'ı değiştirin
- Ayarları optimize edin

Başarılar!
