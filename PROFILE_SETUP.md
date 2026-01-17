# Discord Bot Profile Configuration

**Author:** Wildflover  
**Purpose:** Custom bot profile setup guide

## Bot Profile Settings

### Activity Status
- **Type:** Playing
- **Text:** Wildflover
- **Status:** Online (Green)

### Biography/About Me
**Text:** `Crafted with passion & caffeine`

## How to Set Biography

Bot biyografisi (About Me) Discord Developer Portal üzerinden manuel olarak ayarlanmalıdır çünkü Discord API bu özelliği desteklemiyor.

### Manual Setup Steps

1. **Discord Developer Portal'a Git**
   - https://discord.com/developers/applications

2. **Botunu Seç**
   - Applications listesinden botunu bul

3. **Bot Sekmesine Git**
   - Sol menüden "Bot" sekmesini aç

4. **About Me Bölümünü Bul**
   - Aşağı kaydır
   - "About Me" alanını bul

5. **Biyografi Ekle**
   ```
   Crafted with passion & caffeine
   ```

6. **Save Changes**
   - Değişiklikleri kaydet

## Activity Status (Otomatik)

Activity status kod tarafından otomatik ayarlanıyor:

```javascript
this.client.user.setPresence({
  activities: [{ 
    name: 'Wildflover',
    type: 0  // 0 = Playing
  }],
  status: 'online'
});
```

### Activity Types

- `0` → Playing
- `1` → Streaming
- `2` → Listening to
- `3` → Watching
- `5` → Competing in

## Bot Avatar (Optional)

Eğer bot avatarını değiştirmek istersen:

1. Developer Portal → Bot sekmesi
2. "Reset Avatar" butonuna tıkla
3. Yeni resmi yükle (512x512 önerilir)
4. Save Changes

## Verification

Bot başlatıldığında Discord'da şu şekilde görünecek:

```
Bot Name
Playing Wildflover
```

Profile tıklandığında:
```
About Me
Crafted with passion & caffeine
```

## Notes

- Activity status her bot restart'ında otomatik ayarlanır
- Biography manuel olarak ayarlanmalı (API desteği yok)
- Avatar değişikliği opsiyonel
- Presence değişiklikleri anında yansır
