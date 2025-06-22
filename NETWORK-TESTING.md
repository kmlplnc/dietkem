# 🌐 Yerel Ağda Test Etme Rehberi

Bu rehber, Dietkem uygulamasını yerel ağınızdaki diğer cihazlardan (telefon, tablet, başka bilgisayar) test etmek için kullanılır.

## 🚀 Hızlı Başlangıç

### 1. Sunucuları Başlatın
```bash
pnpm dev
```

### 2. Ağ Bilgilerini Görün
```bash
node get-network-info.js
```

### 3. Diğer Cihazlardan Erişin
Aşağıdaki URL'lerden birini kullanarak diğer cihazlardan erişebilirsiniz:

- **Web Uygulaması**: `http://192.168.1.2:3003`
- **API Sunucusu**: `http://192.168.1.2:3001`
- **Sağlık Kontrolü**: `http://192.168.1.2:3001/health`

## 📱 Test Senaryoları

### Mobil Cihaz Testi
1. Telefonunuzu aynı Wi-Fi ağına bağlayın
2. Tarayıcıda `http://192.168.1.2:3003` adresini açın
3. Uygulamayı test edin

### Tablet Testi
1. Tabletinizi aynı ağa bağlayın
2. Tarayıcıda web uygulamasını açın
3. Responsive tasarımı test edin

### Başka Bilgisayar Testi
1. Diğer bilgisayarı aynı ağa bağlayın
2. Farklı tarayıcılarda test edin

## 🔧 Konfigürasyon Detayları

### Web Sunucusu (Vite)
- **Port**: 3003
- **Host**: 0.0.0.0 (tüm ağ arayüzleri)
- **Proxy**: API istekleri otomatik olarak 3001 portuna yönlendirilir

### API Sunucusu (Express)
- **Port**: 3001
- **Host**: 0.0.0.0 (tüm ağ arayüzleri)
- **CORS**: Yerel ağ IP'lerine izin verilir

## 🌍 Desteklenen Ağ Aralıkları

CORS ayarları aşağıdaki IP aralıklarını destekler:
- `192.168.x.x` (Yaygın ev/ofis ağları)
- `10.x.x.x` (Büyük ağlar)
- `172.16-31.x.x` (Kurumsal ağlar)
- `127.0.0.1` (Localhost)

## 🔍 Sorun Giderme

### Bağlantı Sorunları
1. **Firewall Kontrolü**: Windows Defender'da 3001 ve 3003 portlarına izin verin
2. **Ağ Bağlantısı**: Her iki cihazın da aynı ağda olduğundan emin olun
3. **Port Kullanımı**: Portların başka uygulamalar tarafından kullanılmadığından emin olun

### CORS Hataları
- API sunucusu yeniden başlatın: `pnpm dev`
- Tarayıcı cache'ini temizleyin
- Farklı tarayıcı deneyin

### Performans Sorunları
- Ağ hızını kontrol edin
- Gereksiz uygulamaları kapatın
- Sunucu loglarını kontrol edin

## 📊 Test Kontrol Listesi

- [ ] Web uygulaması ağdan erişilebilir
- [ ] API sunucusu ağdan erişilebilir
- [ ] Giriş/kayıt işlemleri çalışıyor
- [ ] Diyetisyen paneli çalışıyor
- [ ] Danışan paneli çalışıyor
- [ ] Responsive tasarım mobilde uygun
- [ ] Online görüşme özelliği çalışıyor
- [ ] Dosya yükleme işlemleri çalışıyor

## 🛡️ Güvenlik Notları

⚠️ **Önemli**: Bu konfigürasyon sadece geliştirme/test amaçlıdır!

- Production'da kullanmayın
- Güvenlik duvarı ayarlarını kontrol edin
- Sadece güvendiğiniz ağlarda test edin
- Test sonrası normal konfigürasyona dönün

## 📞 Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin
2. Network sekmesinde hataları inceleyin
3. Sunucu loglarını kontrol edin
4. Ağ bağlantısını test edin: `ping 192.168.1.2` 