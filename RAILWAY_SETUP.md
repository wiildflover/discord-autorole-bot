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

### OAuth Configuration (Alternative Login)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OAUTH_REDIRECT_URI` | OAuth callback URL (Tauri app) | `http://tauri.localhost/auth/callback` | ⚠️ Optional* |

> **Note:** Default redirect URI is `http://tauri.localhost/auth/callback` (Tauri application).  
> **Important:** OAuth callback goes to **user's local Tauri application**, not Railway server!  
> This value is already set as default, no need to add to Railway variables.

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

## OAuth System Setup

Alternative login sistemi için ek konfigürasyon:

### 1. Discord Developer Portal
1. [Discord Developer Portal](https://discord.com/developers/applications) → Your Application
2. **OAuth2** → **Redirects** bölümüne gidin
3. Aşağıdaki redirect URI'nin ekli olduğundan emin olun:
   - ✓ `http://tauri.localhost/auth/callback` (Tauri app - default)
4. **Save Changes**

### 2. Railway Variables
```bash
# OAUTH_REDIRECT_URI eklemenize gerek YOK!
# Kod zaten default olarak http://tauri.localhost/auth/callback kullanıyor
```

### 3. Önemli Not
OAuth callback **kullanıcının bilgisayarındaki Tauri uygulamasına** gider, Railway sunucusuna değil!
Bu yüzden `tauri.localhost` kullanılması normaldir.

### 4. Test OAuth System
```bash
# Discord sunucunuzda komutu çalıştırın
/authlogin setup
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
```

### ❌ Missing CLIENT_ID
```
[AUTHLOGIN-SETUP] OAuth client ID not configured
Error: CLIENT_ID is missing in Railway environment variables
```

### ⚠️ Missing OAUTH_REDIRECT_URI
```
[AUTHLOGIN-SETUP] Using default redirect URI
Warning: Set OAUTH_REDIRECT_URI in Railway for production
```

---

## Troubleshooting

### Problem: "CLIENT_ID is missing"
**Solution:** Railway dashboard → Variables → Add `CLIENT_ID`

### Problem: OAuth redirect fails
**Solution:** 
1. Check `OAUTH_REDIRECT_URI` in Railway
2. Verify redirect URI in Discord Developer Portal
3. Ensure both URLs match exactly

### Problem: Bot can't assign roles
**Solution:**
1. Check `ROLE_ID` is correct
2. Verify bot has `MANAGE_ROLES` permission
3. Ensure bot role is higher than target role

---

## Deployment Checklist

- [ ] All required environment variables set in Railway
- [ ] `NODE_ENV` set to `production`
- [ ] OAuth redirect URI configured in Discord Developer Portal
- [ ] Bot has necessary permissions in Discord server
- [ ] Bot role hierarchy is correct
- [ ] Test `/authlogin setup` command
- [ ] Verify role assignment works

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
