# GitHub Integration Workflow

Sistem Git otomatis untuk Balai Bahasa Sultra dengan safety features.

## 🚀 Quick Start

### 1. Initial Setup
```bash
# Jalankan setup untuk pertama kali
./setup-github.bat    # Windows
./setup-github.sh     # Linux/Mac

# Atau setup manual:
git remote add origin https://github.com/username/repo.git
git branch -M main
```

### 2. Push Changes
```bash
# Auto push dengan safety checks
./push-to-github.bat    # Windows
./push-to-github.sh     # Linux/Mac
```

### 3. Monitor Status
```bash
# Cek status lengkap
./git-status.sh
```

### 4. Emergency Rollback
```bash
# Rollback aman dengan backup
./safe-rollback.sh
```

## 📋 Workflow Features

### ✨ Smart Branching
- **Fitur baru** → Otomatis buat `feature/` branch
- **Minor fixes** → Langsung ke `main` branch
- **Safety** → Backup otomatis sebelum rollback

### 🔒 Safety Features
- **Backup branch** otomatis saat rollback
- **Confirmation prompts** untuk setiap action
- **Force-with-lease** untuk safe push
- **Status monitoring** real-time

### 📊 Monitoring
- Git status check
- Remote connectivity test
- Unpushed commits tracking
- Branch synchronization

## 🎯 Best Practices

### Untuk Fitur Baru:
1. Jalankan `./push-to-github.sh`
2. Pilih "y" untuk fitur baru
3. System akan buat feature branch otomatis
4. Push ke feature branch
5. Create Pull Request di GitHub
6. Code review dan merge ke main

### Untuk Minor Fixes:
1. Jalankan `./push-to-github.sh`
2. Pilih "n" untuk minor changes
3. System akan langsung push ke main
4. Otomatis commit dengan timestamp

### Emergency Recovery:
1. Jalankan `./safe-rollback.sh`
2. System buat backup branch otomatis
3. Rollback ke commit sebelumnya
4. Backup branch tersedia untuk recovery

## 🔧 Konfigurasi

### Required Setup:
- GitHub repository
- Git konfigurasi (sudah OK)
- Remote origin connection

### SSH Setup (Recommended):
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Add SSH key ke GitHub account
```

### HTTPS Setup:
Gunakan GitHub Personal Access Token jika 2FA enabled.

## 📝 File Structure

```
project-root/
├── setup-github.sh/bat    # Initial setup script
├── push-to-github.sh/bat  # Auto push script
├── safe-rollback.sh       # Emergency rollback
├── git-status.sh          # Status monitoring
└── GITHUB_WORKFLOW.md     # This documentation
```

## ⚠️ Important Notes

1. **Selalu commit** setelah fitur selesai
2. **Test** sebelum push ke main
3. **Backup** system otomatis aktif
4. **Rollback** tersedia kapan saja

## 🆘 Troubleshooting

### Connection Issues:
```bash
# Test koneksi GitHub
git ls-remote origin

# Reset remote
git remote remove origin
./setup-github.sh
```

### Push Issues:
```bash
# Force push (emergency only)
git push --force-with-lease origin main
```

### Authentication Issues:
- Setup SSH key untuk auth tanpa password
- Gunakan Personal Access Token untuk HTTPS