# GitHub Token Oluşturma Rehberi

**Author:** Wildflover  
**Purpose:** GitHub Personal Access Token oluşturma kılavuzu

## Token Oluşturma Adımları

### 1. GitHub Settings'e Git

```
1. GitHub'da sağ üst köşedeki profil fotoğrafına tıkla
2. "Settings" seç
3. Sol menüden en altta "Developer settings" tıkla
4. "Personal access tokens" → "Tokens (classic)" seç
5. "Generate new token" → "Generate new token (classic)" tıkla
```

### 2. Token Ayarları

**Note (Token adı):**
```
Discord Bot Deployment
```

**Expiration (Süre):**
```
90 days (veya istediğin süre)
```

**Select scopes (İzinler):**
```
✓ repo (tüm repo izinleri)
  ✓ repo:status
  ✓ repo_deployment
  ✓ public_repo
  ✓ repo:invite
  ✓ security_events

✓ workflow (GitHub Actions için)
```

### 3. Token'ı Kopyala

```
1. "Generate token" butonuna tıkla
2. Oluşan token'ı HEMEN kopyala
3. Güvenli bir yere kaydet (bir daha göremezsin)
```

## Token Formatı

Token şu şekilde görünecek:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Otomatik Deployment Kullanımı

### Komut

```bash
cd discord-bot
npm run setup-github
```

### Script Ne Yapacak?

1. GitHub token'ını soracak
2. Kullanıcı bilgilerini çekecek
3. Otomatik repo oluşturacak
4. Git init yapacak
5. Dosyaları commit edecek
6. GitHub'a push edecek

### Örnek Çıktı

```
[GITHUB-SETUP] Discord Bot GitHub Deployment Automation
[AUTHOR] Wildflover
Enter your GitHub Personal Access Token: ghp_xxxxx...
[GITHUB-API] Fetching user information...
[SUCCESS] Authenticated as: wildflover
[GITHUB-API] Creating repository: discord-autorole-bot
[SUCCESS] Repository created: https://github.com/wildflover/discord-autorole-bot
[GIT-SETUP] Initializing Git repository...
[GIT-COMMAND] Initializing Git
[GIT-COMMAND] Adding files to staging
[GIT-COMMAND] Creating initial commit
[GIT-COMMAND] Setting main branch
[GIT-COMMAND] Adding remote origin
[GIT-COMMAND] Pushing to GitHub
[SUCCESS] Repository successfully pushed to GitHub!
[COMPLETE] GitHub setup completed successfully!
[REPOSITORY] https://github.com/wildflover/discord-autorole-bot
[NEXT-STEP] Deploy to Railway.app using this repository
```

## Güvenlik Notları

### Token Güvenliği

- Token'ı asla paylaşma
- Token'ı kod içine yazma
- Token'ı GitHub'a yükleme
- Kullanım sonrası token'ı revoke edebilirsin

### Token Revoke (İptal Etme)

```
1. GitHub Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Token'ın yanındaki "Delete" butonuna tıkla
```

## Sorun Giderme

### "Bad credentials" Hatası

- Token'ı doğru kopyaladın mı kontrol et
- Token'ın süresi dolmuş olabilir
- Yeni token oluştur

### "Repository already exists" Hatası

- Normal, script devam edecek
- Mevcut repo kullanılacak

### "Permission denied" Hatası

- Token'ın `repo` iznine sahip olduğundan emin ol
- Yeni token oluştur ve tüm repo izinlerini ver

## Manuel Alternatif

Eğer script çalışmazsa manuel yol:

```bash
# 1. GitHub'da manuel repo oluştur
# 2. Terminal'de:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/discord-autorole-bot.git
git push -u origin main
```

## Sonraki Adım

Token oluşturduktan sonra:

```bash
npm run setup-github
```

Komutunu çalıştır ve token'ı yapıştır.
