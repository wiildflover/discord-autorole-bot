# Railway Environment Variables Setup
**Author:** Wildflover  
**Description:** Complete guide for configuring Discord bot on Railway platform

---

## Required Environment Variables

Railway'de bot'un çalışması için aşağıdaki environment variables'ları ayarlamanız gerekiyor:

### Core Bot Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `CLIENT_ID` | Discord application client ID | `1458923588475293872` | ✅ Yes |
| `DISCORD_TOKEN` | Discord bot token | `MTQ1ODkyMzU4ODQ3NTI5Mzg3Mg...` | ✅ Yes |
| `NODE_ENV` | Node environment | `production` | ✅ Yes |

### Channel & User Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `TARGET_CHANNEL_ID` | Channel ID for role assignment | `1459249995118153873` | ✅ Yes |
| `TARGET_USER_ID` | User ID to mention for role trigger | `1457725804384358471` | ✅ Yes |

### Role Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `ROLE_ID` | Role ID to assign | `1234567890123456789` | ✅ Yes |
| `ROLE_NAME` | Role name (display) | `Verified` | ⚠️ Optional |

### Message Configuration

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DELETE_MESSAGE_DELAY` | Message deletion delay (ms) | `3500` | ⚠️ Optional |

---

## Configuration Priority

Bot konfigürasyonu şu öncelik sırasına göre yüklenir:

```
Railway Environment Variables > config.json > Default Values
```

### Local Development
```json
// config.json kullanılır
{
  "token": "YOUR_TOKEN",
  "clientId": "YOUR_CLIENT_ID",
  ...
}
```

### Railway Production
```bash
# Environment variables kullanılır
CLIENT_ID=1458923588475293872
DISCORD_TOKEN=MTQ1ODkyMzU4...
NODE_ENV=production
```

---

## Alternative Login System

Bot verification sistemi için konfigürasyon:

### 1. Discord'da Komut Kullanımı
```bash
# Discord sunucunuzda komutu çalıştırın
/authlogin setup

# "Get Verified" butonuna tıklayın
# Bot sizi verified olarak işaretleyecek
```

### 2. Uygulama Girişi
1. Wildflover uygulamasını açın
2. "Login with Discord" ile normal giriş yapın
3. "Alternative Login" butonuna tıklayın
4. Bot API'si verification durumunuzu kontrol edecek
5. Verified iseniz otomatik giriş yapılacak

### 3. Sistem Mimarisi
```
Discord Bot → In-Memory Storage → HTTP API (Port 3000)
                                        ↓
                              Tauri App API Check
```

### 4. API Endpoint
```bash
GET /api/verify/check?userId={DISCORD_USER_ID}

Response:
{
  "verified": true,
  "user": {
    "id": "123456789",
    "username": "wildflover",
    "discriminator": "0",
    "avatar": "...",
    "global_name": "Wildflover"
  },
  "timestamp": 1706012345678
}
```

---

## Environment Variables Validation

Bot başlatıldığında şu kontroller yapılır:

### ✅ Successful Start
```
[BOT-READY] Logged in as WildfloverBot#1234
[BOT-STATUS] Monitoring channel: 1459249995118153873
[BOT-STATUS] Target user: 1457725804384358471
[BOT-INIT] Verification system initialized
[VERIFY-API] Verification API listening on port 3000
```

### ❌ Missing Environment Variable
```
[BOT-ERROR] Required environment variable missing
Error: DISCORD_TOKEN is not set in Railway variables
```

---

## Troubleshooting

### Problem: "Verification API not responding"
**Solution:** 
1. Check Railway logs for API initialization
2. Verify PORT environment variable (Railway auto-assigns)
3. Ensure bot is running without errors

### Problem: "Alternative Login" not working
**Solution:**
1. Discord'da `/authlogin setup` ile verified olduğunuzdan emin olun
2. "Get Verified" butonuna bastığınızı kontrol edin
3. Railway bot API URL'inin doğru olduğunu kontrol edin
4. Bot restart olduysa in-memory storage temizlenmiş olabilir

### Problem: Bot can't assign roles
**Solution:**
1. Check `ROLE_ID` is correct
2. Verify bot has `MANAGE_ROLES` permission
3. Ensure bot role is higher than target role

---

## Deployment Checklist

- [ ] All required environment variables set in Railway
- [ ] `NODE_ENV` set to `production`
- [ ] Bot has necessary permissions in Discord server
- [ ] Bot role hierarchy is correct
- [ ] Test `/authlogin setup` command
- [ ] Test "Get Verified" button
- [ ] Test "Alternative Login" in Tauri app
- [ ] Verify API endpoint responds correctly

---

## Security Notes

⚠️ **Never commit sensitive data to repository:**
- ❌ Don't commit `.env` files
- ❌ Don't commit `config.json` with real tokens
- ✅ Use Railway environment variables
- ✅ Keep `.env.example` for reference only

---

## Support

For issues or questions:
- Check Railway logs: `railway logs`
- Review bot console output
- Verify all environment variables are set correctly
