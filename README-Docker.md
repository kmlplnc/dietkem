# DietKem Docker Deployment

Bu proje Docker ve Docker Compose kullanarak VPS'te çalışacak şekilde yapılandırılmıştır.

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Ubuntu 22.04 (veya üzeri)
- Docker
- Docker Compose
- Git

### 1. Projeyi İndirin

```bash
git clone <your-repo-url>
cd dietkem
```

### 2. Environment Dosyasını Hazırlayın

```bash
cp env.example .env
nano .env
```

`.env` dosyasını düzenleyin:

```env
# Database Configuration
POSTGRES_DB=dietkem
POSTGRES_USER=dietkem_user
POSTGRES_PASSWORD=your_secure_password_here

# API Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here_minimum_32_chars
NEXTAUTH_URL=https://yourdomain.com
RESEND_API_KEY=your_resend_api_key_here

# Frontend Configuration
VITE_API_URL=https://yourdomain.com
```

### 3. SSL Sertifikalarını Hazırlayın

```bash
# SSL dizini oluşturun
mkdir -p ssl

# Self-signed sertifika (test için)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Veya Let's Encrypt sertifikalarınızı kopyalayın
# cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
# cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
```

### 4. Deploy Edin

```bash
# Deploy script'ini çalıştırılabilir yapın
chmod +x deploy.sh

# Deploy edin
./deploy.sh deploy
```

## 📁 Dosya Yapısı

```
dietkem/
├── docker-compose.yml          # Ana Docker Compose dosyası
├── docker-compose.prod.yml     # Production Docker Compose dosyası
├── Dockerfile.api             # API service Dockerfile
├── Dockerfile.web             # Web service Dockerfile
├── nginx.conf                 # Nginx reverse proxy konfigürasyonu
├── nginx-spa.conf             # Web container nginx konfigürasyonu
├── deploy.sh                  # Deploy script'i
├── env.example                # Environment variables template
├── .env                       # Environment variables (oluşturulacak)
├── ssl/                       # SSL sertifikaları
│   ├── cert.pem
│   └── key.pem
└── backups/                   # Database yedekleri
```

## 🔧 Servisler

### 1. PostgreSQL Database
- **Port:** 5432 (internal)
- **Volume:** `postgres_data`
- **Health Check:** Otomatik

### 2. API Backend
- **Port:** 3001 (internal)
- **Dependencies:** PostgreSQL
- **Features:** 
  - NextAuth.js authentication
  - tRPC API
  - Database migrations
  - Health checks

### 3. Web Frontend
- **Port:** 3000 (internal)
- **Dependencies:** API
- **Features:**
  - React SPA
  - Nginx serving
  - Static file caching

### 4. Nginx Reverse Proxy
- **Ports:** 80, 443 (external)
- **Features:**
  - SSL termination
  - Load balancing
  - Rate limiting
  - Security headers
  - Gzip compression

## 🛠️ Yönetim Komutları

### Deploy Script Kullanımı

```bash
# Servisleri başlat
./deploy.sh deploy

# Servisleri durdur
./deploy.sh stop

# Servisleri yeniden başlat
./deploy.sh restart

# Logları görüntüle
./deploy.sh logs

# Servisleri güncelle
./deploy.sh update

# Database yedekle
./deploy.sh backup

# Database geri yükle
./deploy.sh restore backup_20241201_120000.sql

# Servis durumunu kontrol et
./deploy.sh status

# Yardım
./deploy.sh help
```

### Docker Compose Komutları

```bash
# Servisleri başlat
docker-compose up -d

# Servisleri durdur
docker-compose down

# Logları görüntüle
docker-compose logs -f

# Belirli servisin loglarını görüntüle
docker-compose logs -f api

# Servisleri yeniden build et
docker-compose build --no-cache

# Servisleri güncelle
docker-compose pull && docker-compose up -d
```

## 🔒 Güvenlik

### Environment Variables
- Tüm hassas bilgiler `.env` dosyasında saklanır
- Production'da güçlü şifreler kullanın
- `NEXTAUTH_SECRET` en az 32 karakter olmalı

### SSL/TLS
- Production'da Let's Encrypt sertifikaları kullanın
- Self-signed sertifikalar sadece test için

### Network Security
- Servisler internal network'te çalışır
- Sadece Nginx external port'ları expose eder
- Rate limiting aktif

## 📊 Monitoring

### Health Checks
- **API:** `http://localhost:3001/health`
- **Web:** `http://localhost:3000/health`
- **Database:** Otomatik PostgreSQL health check

### Logs
```bash
# Tüm logları görüntüle
docker-compose logs -f

# Belirli servisin loglarını görüntüle
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f postgres
docker-compose logs -f nginx
```

## 🔄 Backup ve Restore

### Database Backup
```bash
# Otomatik backup
./deploy.sh backup

# Manuel backup
docker-compose exec -T postgres pg_dump -U dietkem_user dietkem > backup.sql
```

### Database Restore
```bash
# Otomatik restore
./deploy.sh restore backup_20241201_120000.sql

# Manuel restore
docker-compose exec -T postgres psql -U dietkem_user dietkem < backup.sql
```

## 🚨 Troubleshooting

### Servis Başlamıyor
```bash
# Logları kontrol et
docker-compose logs

# Servisleri yeniden başlat
docker-compose restart

# Volume'ları temizle (dikkatli olun!)
docker-compose down -v
```

### Database Bağlantı Hatası
```bash
# Database servisinin durumunu kontrol et
docker-compose ps postgres

# Database loglarını kontrol et
docker-compose logs postgres

# Database'e bağlan
docker-compose exec postgres psql -U dietkem_user -d dietkem
```

### SSL Sertifika Hatası
```bash
# Sertifika dosyalarını kontrol et
ls -la ssl/

# Nginx loglarını kontrol et
docker-compose logs nginx
```

## 🔧 Production Optimizasyonları

### 1. Resource Limits
`docker-compose.yml` dosyasına ekleyin:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
```

### 2. Log Rotation
```yaml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 3. Auto-restart Policy
```yaml
services:
  api:
    restart: unless-stopped
```

## 📞 Destek

Sorun yaşarsanız:
1. Logları kontrol edin: `./deploy.sh logs`
2. Servis durumunu kontrol edin: `./deploy.sh status`
3. Environment variables'ları kontrol edin
4. SSL sertifikalarını kontrol edin

## 🔄 Güncelleme

```bash
# Kodu güncelle
git pull

# Servisleri güncelle
./deploy.sh update

# Veya manuel olarak
docker-compose build --no-cache
docker-compose up -d
``` 