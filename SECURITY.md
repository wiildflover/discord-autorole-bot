# Security Guide

**Author:** Wildflover  
**Purpose:** Secure configuration management for Discord bot

## Token Security

### Local Development

**config.json kullan (Git'e yüklenmiyor):**

```json
{
  "token": "GERÇEK_TOKEN_BURAYA",
  "clientId": "GERÇEK_CLIENT_ID",
  "targetChannelId": "KANAL_ID",
  "targetUserId": "KULLANICI_ID",
  "roleId": "ROL_ID",
  "roleName": "Verified",
  "deleteMessageDelay": 3500
}
```

### Railway.app Deployment

**Environment Variables kullan:**

Railway Dashboard → Project → Variables sekmesi:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
TARGET_CHANNEL_ID=channel_id_here
TARGET_USER_ID=user_id_here
ROLE_ID=role_id_here
ROLE_NAME=Verified
DELETE_MESSAGE_DELAY=3500
```

## Configuration Priority

Bot şu sırayla config yükler:

1. **config.json** (varsa, local development için)
2. **Environment Variables** (yoksa, production için)

## Setup Instructions

### Local Development

```bash
# config.example.json'dan kopyala
cp config.example.json config.json

# config.json'u düzenle (gerçek değerleri gir)
# Bu dosya .gitignore'da, GitHub'a yüklenmeyecek
```

### Railway Deployment

```bash
# 1. config.json'suz push et
git add .
git commit -m "Deploy to Railway"
git push

# 2. Railway'de environment variables ekle
# Dashboard → Variables → Add Variable
```

## .gitignore Protection

Şu dosyalar GitHub'a yüklenmez:

```
config.json           # Gerçek token'lar burada
config.json.backup    # Yedek dosyalar
.env                  # Environment variables
```

## Token Leaked? (Token Sızdı mı?)

Eğer yanlışlıkla token GitHub'a yüklendiyse:

1. **Hemen Token'ı Reset Et**
   - Discord Developer Portal
   - Bot sekmesi
   - "Reset Token" butonuna tıkla

2. **Git History'den Sil**
   ```bash
   # Tüm history'den config.json'u sil
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch config.json" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   ```

3. **Yeni Token'ı Güvenli Şekilde Ekle**
   - Railway environment variables kullan
   - Veya local'de config.json (gitignore'da)

## Best Practices

1. **Asla token'ı kod içine hardcode etme**
2. **config.json'u Git'e ekleme**
3. **Environment variables kullan (production)**
4. **Token'ı düzenli olarak rotate et**
5. **Private repo kullan (mümkünse)**

## Verification

GitHub'a push etmeden önce kontrol et:

```bash
# Hangi dosyaların yükleneceğini gör
git status

# config.json listede OLMAMALI
# Eğer varsa:
git rm --cached config.json
git commit -m "Remove config.json from tracking"
```

## Railway Environment Variables Setup

Railway Dashboard'da şu değişkenleri ekle:

| Variable Name | Example Value | Description |
|--------------|---------------|-------------|
| DISCORD_TOKEN | MTQ1ODky... | Bot token from Discord Developer Portal |
| CLIENT_ID | 1458923588... | Application ID |
| TARGET_CHANNEL_ID | 1459249995... | Channel to monitor |
| TARGET_USER_ID | 1457725804... | User to watch for mentions |
| ROLE_ID | 1458931524... | Role to assign |
| ROLE_NAME | Verified | Role display name |
| DELETE_MESSAGE_DELAY | 3500 | Message deletion delay (ms) |

## Support

Token güvenliği konusunda sorular için Wildflover ile iletişime geç.
