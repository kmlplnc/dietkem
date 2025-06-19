import React from 'react';

const CalorieCalculator = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const gender = formData.get('gender') as string;
    const age = parseInt(formData.get('age') as string);
    const weight = parseFloat(formData.get('weight') as string);
    const height = parseFloat(formData.get('height') as string);
    const activity = formData.get('activity') as string;
    const goal = formData.get('goal') as string;
    
    if (!gender || !age || !weight || !height || !activity || !goal) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }
    
    // BMR hesaplama (Mifflin-St Jeor formülü)
    let bmr = 0;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Aktivite faktörleri
    const activityFactors: { [key: string]: number } = {
      'sedentary': 1.2,
      'lightly_active': 1.375,
      'moderately_active': 1.55,
      'very_active': 1.725,
      'extremely_active': 1.9
    };
    
    const tdee = bmr * activityFactors[activity];
    
    // Hedef bazlı kalori hesaplama
    let targetCalories = 0;
    let explanation = '';
    
    switch (goal) {
      case 'lose':
        targetCalories = Math.round(tdee - 500);
        explanation = `Kilo vermek için günlük ${targetCalories} kalori almanız önerilir.`;
        break;
      case 'maintain':
        targetCalories = Math.round(tdee);
        explanation = `Kilonuzu korumak için günlük ${targetCalories} kalori almanız önerilir.`;
        break;
      case 'gain':
        targetCalories = Math.round(tdee + 300);
        explanation = `Kas kazanmak için günlük ${targetCalories} kalori almanız önerilir.`;
        break;
    }
    
    // Sonuçları göster
    const resultBox = document.getElementById('result-box');
    const resultValue = document.getElementById('result-value');
    const resultExplanation = document.getElementById('result-explanation');
    
    if (resultBox && resultValue && resultExplanation) {
      resultValue.textContent = targetCalories.toString();
      resultExplanation.textContent = explanation;
      resultBox.style.display = 'block';
      resultBox.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="calorie-calculator-page">
      <div className="container">
        {/* Üst Başlık */}
        <div className="header">
          <h1 className="main-title">Kalori Hesaplama Aracı</h1>
        </div>

        {/* TDEE Formu */}
        <div className="calculator-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="gender">Cinsiyet</label>
              <select id="gender" name="gender" className="form-input" required>
                <option value="">Seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="age">Yaş</label>
              <input 
                type="number" 
                id="age" 
                name="age"
                className="form-input"
                min="15" 
                max="100" 
                placeholder="25" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Kilo (kg)</label>
              <input 
                type="number" 
                id="weight" 
                name="weight"
                className="form-input"
                min="30" 
                max="300" 
                step="0.1" 
                placeholder="70" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="height">Boy (cm)</label>
              <input 
                type="number" 
                id="height" 
                name="height"
                className="form-input"
                min="100" 
                max="250" 
                placeholder="170" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="activity">Aktivite Seviyesi</label>
              <select id="activity" name="activity" className="form-input" required>
                <option value="">Seçiniz</option>
                <option value="sedentary">Hareketsiz (Ofis işi)</option>
                <option value="lightly_active">Az Aktif (Hafif egzersiz)</option>
                <option value="moderately_active">Orta Aktif (Orta egzersiz)</option>
                <option value="very_active">Aktif (Yoğun egzersiz)</option>
                <option value="extremely_active">Çok Aktif (Çok yoğun egzersiz)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="goal">Hedef</label>
              <select id="goal" name="goal" className="form-input" required>
                <option value="">Seçiniz</option>
                <option value="lose">Kilo Vermek</option>
                <option value="maintain">Kilonu Koru</option>
                <option value="gain">Kas Kazanmak</option>
              </select>
            </div>

            <button type="submit" className="calculate-btn">
              Hesapla
            </button>
          </form>
        </div>

        {/* Sonuç Kutusu */}
        <div id="result-box" className="result-box" style={{ display: 'none' }}>
          <div className="result-header">
            <h3>Günlük Kalori İhtiyacınız</h3>
          </div>
          <div className="result-content">
            <div className="calorie-value">
              <span id="result-value">0</span>
              <span className="unit">kcal</span>
            </div>
            <p id="result-explanation" className="result-explanation">
              Sonuç açıklaması burada görünecek.
            </p>
          </div>
        </div>

        {/* Bilgilendirici Kartlar */}
        <div className="info-cards">
          <div className="info-card weight-loss">
            <div className="card-icon">🔥</div>
            <h3 className="card-title">Zayıflamak İçin</h3>
            <p className="card-content">
              TDEE'den 400–600 kcal çıkararak sağlıklı kilo verilebilir. 
              Bu yaklaşım haftada 0.5-1 kg kaybı sağlar.
            </p>
          </div>

          <div className="info-card muscle-gain">
            <div className="card-icon">🏋️‍♂️</div>
            <h3 className="card-title">Kas Kazanmak İçin</h3>
            <p className="card-content">
              Kas kazanımı için TDEE üzerine 200–300 kcal eklenebilir. 
              Bu yaklaşım kas kütlesini artırırken yağ artışını minimize eder.
            </p>
          </div>

          <div className="info-card macros">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Kalori ve Makrolar</h3>
            <p className="card-content">
              1g Protein = 4 kcal<br/>
              1g Karbonhidrat = 4 kcal<br/>
              1g Yağ = 9 kcal<br/>
              1g Alkol = 7 kcal
            </p>
          </div>
        </div>

        {/* Bilimsel Açıklamalar */}
        <div className="scientific-info">
          <div className="info-section">
            <h2 className="section-title">🔬 Kalori Hesaplama Bilimi</h2>
            <div className="info-content">
              <h3>TDEE (Total Daily Energy Expenditure) Nedir?</h3>
              <p>
                TDEE, günlük toplam enerji harcamanızı ifade eder. Bu değer, vücudunuzun 
                günlük aktivitelerinizi sürdürmek için ihtiyaç duyduğu toplam kalori miktarıdır. 
                TDEE hesaplaması şu bileşenleri içerir:
              </p>
              <ul>
                <li><strong>BMR (Bazal Metabolizma Hızı):</strong> Vücudunuzun dinlenme halindeyken harcadığı enerji</li>
                <li><strong>Fiziksel Aktivite:</strong> Egzersiz ve günlük hareketlerle harcanan enerji</li>
                <li><strong>Termik Etki:</strong> Besinlerin sindirimi ve metabolizması için harcanan enerji</li>
                <li><strong>NEAT:</strong> Günlük aktiviteler (yürüme, ayakta durma vb.) için harcanan enerji</li>
              </ul>
            </div>
          </div>

          <div className="info-section">
            <h2 className="section-title">⚖️ Kilo Yönetimi Prensipleri</h2>
            <div className="info-content">
              <h3>Kilo Verme (Kalori Açığı)</h3>
              <p>
                Kilo vermek için günlük kalori alımınızı TDEE'nizin altında tutmanız gerekir. 
                Sağlıklı kilo kaybı için günde 500-750 kcal açık oluşturmanız önerilir. 
                Bu yaklaşım haftada 0.5-1 kg kaybı sağlar ve kas kaybını minimize eder.
              </p>
              
              <h3>Kilo Koruma (Kalori Dengesi)</h3>
              <p>
                Mevcut kilonuzu korumak için günlük kalori alımınızı TDEE'nizle eşitlemeniz gerekir. 
                Bu durumda vücudunuz ne kilo alır ne de kilo verir. Düzenli ölçüm yaparak 
                bu dengeyi koruyabilirsiniz.
              </p>
              
              <h3>Kilo Alma (Kalori Fazlası)</h3>
              <p>
                Kas kütlesi kazanmak için günlük kalori alımınızı TDEE'nizin üzerinde tutmanız gerekir. 
                Kas kazanımı için günde 200-300 kcal fazla almanız önerilir. Bu yaklaşım 
                kas kütlesini artırırken yağ artışını minimize eder.
              </p>
            </div>
          </div>

          <div className="info-section">
            <h2 className="section-title">📈 Aktivite Düzeyleri ve Enerji Harcaması</h2>
            <div className="info-content">
              <h3>Aktivite Faktörleri</h3>
              <ul>
                <li><strong>Hareketsiz (1.2):</strong> Ofis işi, günlük aktivite yok</li>
                <li><strong>Az Aktif (1.375):</strong> Hafif egzersiz, 1-3 gün/hafta</li>
                <li><strong>Orta Aktif (1.55):</strong> Orta egzersiz, 3-5 gün/hafta</li>
                <li><strong>Aktif (1.725):</strong> Yoğun egzersiz, 6-7 gün/hafta</li>
                <li><strong>Çok Aktif (1.9):</strong> Çok yoğun egzersiz, fiziksel iş</li>
              </ul>
              
              <h3>Hesaplama Formülü</h3>
              <p>
                TDEE = BMR × Aktivite Faktörü<br/>
                BMR (Erkek) = 88.362 + (13.397 × kg) + (4.799 × cm) - (5.677 × yaş)<br/>
                BMR (Kadın) = 447.593 + (9.247 × kg) + (3.098 × cm) - (4.330 × yaş)
              </p>
            </div>
          </div>

          <div className="info-section">
            <h2 className="section-title">⚠️ Önemli Uyarılar</h2>
            <div className="info-content">
              <ul>
                <li>Bu hesaplama genel bir tahmindir ve bireysel farklılıklar olabilir</li>
                <li>Sağlık durumunuz, ilaç kullanımınız ve metabolik hastalıklarınız hesaplamayı etkileyebilir</li>
                <li>Dramatik kalori kısıtlamaları metabolizmanızı yavaşlatabilir</li>
                <li>Düzenli doktor kontrolü ile kilo yönetimi yapmanız önerilir</li>
                <li>Beslenme planınızı bir diyetisyen ile birlikte oluşturmanız en sağlıklı yaklaşımdır</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .calorie-calculator-page {
          background: #f9f9f9;
          min-height: 100vh;
          padding: 2rem 1rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          background: #fff;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        /* Üst Başlık */
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .main-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111;
          margin: 0;
          line-height: 1.2;
        }

        /* Form Stilleri */
        .calculator-form {
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #222;
          font-size: 0.95rem;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border: 2px solid #e1e5e9;
          font-size: 1rem;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-input::placeholder {
          color: #9ca3af;
        }

        .calculate-btn {
          width: 100%;
          padding: 1rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-top: 1rem;
        }

        .calculate-btn:hover {
          background: #45a049;
        }

        /* Sonuç Alanı */
        .result-section {
          margin-bottom: 2rem;
        }

        .result-box {
          background: #e7fbe7;
          padding: 2rem;
          border-radius: 1rem;
          text-align: center;
          border: 2px solid #d4edda;
          margin-bottom: 2rem;
        }

        .result-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #155724;
          margin: 0 0 1rem 0;
        }

        .result-content {
          text-align: center;
        }

        .calorie-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .calorie-value span:first-child {
          font-size: 3rem;
          font-weight: 700;
          color: #155724;
        }

        .unit {
          font-size: 1.5rem;
          font-weight: 600;
          color: #155724;
        }

        .result-explanation {
          font-size: 0.95rem;
          color: #155724;
          margin: 0;
          opacity: 0.8;
        }

        /* Bilgilendirici Kartlar */
        .info-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .info-card {
          background: #fff;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          text-align: center;
          border: 1px solid #f1f5f9;
        }

        .card-icon {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .card-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #222;
          margin: 0 0 0.5rem 0;
        }

        .card-content {
          font-size: 0.8rem;
          color: #4b5563;
          line-height: 1.3;
          margin: 0;
        }

        /* Kart Renk Temaları */
        .weight-loss {
          border-top: 2px solid #10b981;
        }

        .weight-loss .card-icon {
          color: #10b981;
        }

        .muscle-gain {
          border-top: 2px solid #3b82f6;
        }

        .muscle-gain .card-icon {
          color: #3b82f6;
        }

        .macros {
          border-top: 2px solid #6b7280;
        }

        .macros .card-icon {
          color: #6b7280;
        }

        .scientific-info {
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
        }

        .info-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
          border-left: 3px solid #3b82f6;
        }

        .info-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #334155;
          margin: 0.75rem 0 0.5rem 0;
        }

        .info-content h3:first-child {
          margin-top: 0;
        }

        .info-content p {
          font-size: 0.85rem;
          line-height: 1.5;
          color: #475569;
          margin-bottom: 0.5rem;
        }

        .info-content ul {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0;
        }

        .info-content li {
          padding: 0.3rem 0;
          padding-left: 1rem;
          position: relative;
          font-size: 0.85rem;
          line-height: 1.4;
          color: #475569;
        }

        .info-content li:before {
          content: "•";
          color: #3b82f6;
          font-weight: bold;
          position: absolute;
          left: 0;
        }

        .info-content strong {
          color: #1e293b;
          font-weight: 600;
        }

        /* Responsive Tasarım */
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
            margin: 0 0.5rem;
          }

          .main-title {
            font-size: 1.8rem;
          }

          .info-cards {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin: 1rem 0;
          }

          .result-value {
            font-size: 2.5rem;
          }

          .form-input {
            font-size: 16px; /* iOS zoom'u önlemek için */
          }

          .scientific-info {
            padding: 0.75rem;
            margin-top: 1rem;
          }

          .info-section {
            padding: 0.75rem;
            margin-bottom: 1rem;
          }

          .section-title {
            font-size: 1.1rem;
          }

          .info-content h3 {
            font-size: 0.9rem;
          }

          .info-content p {
            font-size: 0.8rem;
          }

          .info-content li {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .calorie-calculator-page {
            padding: 0.5rem;
          }

          .container {
            padding: 0.75rem;
          }

          .main-title {
            font-size: 1.5rem;
          }

          .result-value {
            font-size: 2rem;
          }

          .info-cards {
            margin: 0.75rem 0;
          }

          .scientific-info {
            padding: 0.5rem;
            margin-top: 0.75rem;
          }

          .info-section {
            padding: 0.5rem;
            margin-bottom: 0.75rem;
          }

          .section-title {
            font-size: 1rem;
          }

          .card-icon {
            font-size: 1.5rem;
          }

          .card-title {
            font-size: 0.8rem;
          }

          .card-content {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CalorieCalculator; 