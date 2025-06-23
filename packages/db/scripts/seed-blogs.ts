import { db } from '../src/index';
import { blogs, blog_categories, blog_tags } from '../schema';

async function seedBlogs() {
  console.log('🌱 Seeding blog data...');

  try {
    // Blog kategorilerini ekle
    console.log('Adding blog categories...');
    const categoryData = [
      { name: 'Bilimsel Araştırma', description: 'Bilimsel araştırmalar ve kanıtlar', slug: 'bilimsel-arastirma' },
      { name: 'Dijital Sağlık', description: 'Dijital teknolojiler ve sağlık', slug: 'dijital-saglik' },
      { name: 'Yapay Zeka', description: 'AI ve makine öğrenmesi', slug: 'yapay-zeka' },
      { name: 'İnflamasyon', description: 'Kronik inflamasyon ve beslenme', slug: 'inflamasyon' },
      { name: 'Kronobiyoloji', description: 'Sirkadiyen ritim ve beslenme', slug: 'kronobiyoloji' },
    ];

    const insertedCategories = await db.insert(blog_categories).values(categoryData).returning();
    console.log(`✅ Added ${insertedCategories.length} blog categories`);

    // Blog etiketlerini ekle
    console.log('Adding blog tags...');
    const tagData = [
      { name: 'Mikrobiyota', slug: 'mikrobiyota' },
      { name: 'Metabolizma', slug: 'metabolizma' },
      { name: 'Dijital Teknoloji', slug: 'dijital-teknoloji' },
      { name: 'Beslenme Takibi', slug: 'beslenme-takibi' },
      { name: 'AI', slug: 'ai' },
      { name: 'Kişiselleştirilmiş Beslenme', slug: 'kisisellestirilmis-beslenme' },
      { name: 'Kronik İnflamasyon', slug: 'kronik-inflamasyon' },
      { name: 'Anti-inflamatuar', slug: 'anti-inflamatuar' },
      { name: 'Sirkadiyen Ritim', slug: 'sirkadiyen-ritim' },
      { name: 'Zamanlanmış Beslenme', slug: 'zamanlanmis-beslenme' },
    ];

    const insertedTags = await db.insert(blog_tags).values(tagData).returning();
    console.log(`✅ Added ${insertedTags.length} blog tags`);

    // Blog yazılarını ekle
    console.log('Adding blog posts...');
    const blogData = [
      {
        title: 'Bağırsak Mikrobiyotası ve Metabolik Sağlık: Bilimsel Kanıtlar',
        summary: 'Bağırsak bakterilerinin metabolizma, kilo kontrolü ve genel sağlık üzerindeki etkilerini inceleyen güncel araştırmalar.',
        content: `
          <h2>Bağırsak Mikrobiyotası: Vücudumuzun İkinci Beyni</h2>
          
          <p>Son yıllarda yapılan araştırmalar, bağırsak mikrobiyotasının sadece sindirim sağlığımızı değil, aynı zamanda metabolik sağlığımızı, bağışıklık sistemimizi ve hatta ruh halimizi etkilediğini göstermektedir. İnsan vücudunda yaklaşık 100 trilyon mikroorganizma bulunur ve bunların çoğu bağırsaklarımızda yaşar.</p>

          <h3>Mikrobiyota ve Metabolizma İlişkisi</h3>
          
          <p>2013 yılında Nature dergisinde yayınlanan bir araştırmada, obez ve zayıf bireylerin bağırsak mikrobiyotaları karşılaştırılmıştır. Sonuçlar, obez bireylerde Firmicutes bakterilerinin artışı ve Bacteroidetes bakterilerinin azalışı olduğunu göstermiştir. Bu değişiklik, enerji alımını artıran ve yağ depolanmasını teşvik eden metabolik yolları etkiler.</p>

          <h3>Prebiyotik ve Probiyotiklerin Rolü</h3>
          
          <p>Prebiyotikler, bağırsak bakterilerimizin besin kaynağıdır. İnülin, fruktooligosakkaritler (FOS) ve dirençli nişasta gibi prebiyotikler, faydalı bakterilerin büyümesini destekler. Probiyotikler ise canlı mikroorganizmalardır ve Lactobacillus ve Bifidobacterium türleri en yaygın olanlarıdır.</p>

          <h3>Pratik Öneriler</h3>
          
          <ul>
            <li>Günde 25-30 gram lif tüketin</li>
            <li>Fermente gıdaları (yoğurt, kefir, lahana turşusu) düzenli olarak tüketin</li>
            <li>Çeşitli bitkisel gıdalar tüketin</li>
            <li>Gereksiz antibiyotik kullanımından kaçının</li>
            <li>Düzenli egzersiz yapın</li>
          </ul>

          <h3>Sonuç</h3>
          
          <p>Bağırsak mikrobiyotası, metabolik sağlığımızın merkezinde yer almaktadır. Doğru beslenme alışkanlıkları ve yaşam tarzı değişiklikleri ile mikrobiyotamızı destekleyerek daha sağlıklı bir metabolizma elde edebiliriz.</p>
        `,
        category: 'Bilimsel Araştırma',
        author: 'Dr. Ayşe Kaya',
        image: '/assets/blog/microbiome.png',
        status: 'published',
        slug: 'bagirsak-mikrobiyotasi-ve-metabolik-saglik',
        meta_title: 'Bağırsak Mikrobiyotası ve Metabolik Sağlık: Bilimsel Kanıtlar',
        meta_description: 'Bağırsak bakterilerinin metabolizma, kilo kontrolü ve genel sağlık üzerindeki etkilerini inceleyen güncel araştırmalar.',
        is_featured: true,
        published_at: new Date('2024-06-20')
      },
      {
        title: 'Dijital Teknolojiler ve Beslenme Takibi: Akıllı Uygulamaların Bilimsel Etkinliği',
        summary: 'Dijital beslenme takip uygulamalarının kilo kontrolü ve sağlıklı beslenme alışkanlıkları üzerindeki etkilerini inceleyen klinik çalışmalar.',
        content: `
          <h2>Dijital Beslenme Takibinin Bilimsel Temelleri</h2>
          
          <p>Günümüzde akıllı telefonlar ve giyilebilir teknolojiler, beslenme takibini daha kolay ve etkili hale getirmektedir. 2022 yılında Journal of Medical Internet Research'te yayınlanan bir meta-analiz, dijital beslenme takip uygulamalarının kilo kontrolünde %15-20 daha etkili olduğunu göstermiştir.</p>

          <h3>Akıllı Uygulamaların Avantajları</h3>
          
          <p>Dijital beslenme takip uygulamaları, kullanıcılara anında geri bildirim sağlar ve davranış değişikliğini destekler. Özellikle şu alanlarda etkilidir:</p>

          <ul>
            <li><strong>Farkındalık:</strong> Günlük kalori alımının farkında olma</li>
            <li><strong>Hesap verebilirlik:</strong> Kendi kendini izleme ve raporlama</li>
            <li><strong>Eğitim:</strong> Besin değerleri hakkında bilgi edinme</li>
            <li><strong>Sosyal destek:</strong> Topluluk ve uzman desteği</li>
          </ul>

          <h3>Klinik Çalışma Sonuçları</h3>
          
          <p>2023 yılında Obesity Reviews dergisinde yayınlanan bir çalışmada, 12 hafta boyunca dijital beslenme takibi yapan 500 katılımcı incelenmiştir. Sonuçlar:</p>

          <ul>
            <li>Ortalama 3.2 kg kilo kaybı</li>
            <li>Günlük kalori alımında %18 azalma</li>
            <li>Fiziksel aktivite seviyesinde %25 artış</li>
            <li>Beslenme bilgisi skorunda %40 iyileşme</li>
          </ul>

          <h3>En Etkili Özellikler</h3>
          
          <p>Araştırmalar, en etkili dijital beslenme takip özelliklerini şu şekilde sıralamaktadır:</p>

          <ol>
            <li>Barkod tarama ve otomatik besin tanıma</li>
            <li>Görsel besin veritabanı</li>
            <li>Kişiselleştirilmiş hedefler ve öneriler</li>
            <li>İlerleme grafikleri ve raporlar</li>
            <li>Hatırlatıcılar ve bildirimler</li>
          </ol>

          <h3>Gelecek Perspektifi</h3>
          
          <p>Yapay zeka ve makine öğrenmesi teknolojilerinin gelişmesi ile dijital beslenme takip uygulamaları daha da akıllı hale gelmektedir. Fotoğraf analizi, sesli komutlar ve giyilebilir sensörler ile entegrasyon, kullanıcı deneyimini sürekli iyileştirmektedir.</p>
        `,
        category: 'Dijital Sağlık',
        author: 'Dr. Mehmet Demir',
        image: '/assets/blog/digital-diet.png',
        status: 'published',
        slug: 'dijital-teknolojiler-ve-beslenme-takibi',
        meta_title: 'Dijital Teknolojiler ve Beslenme Takibi: Akıllı Uygulamaların Bilimsel Etkinliği',
        meta_description: 'Dijital beslenme takip uygulamalarının kilo kontrolü ve sağlıklı beslenme alışkanlıkları üzerindeki etkilerini inceleyen klinik çalışmalar.',
        is_featured: true,
        published_at: new Date('2024-06-18')
      },
      {
        title: 'Yapay Zeka Destekli Kişiselleştirilmiş Beslenme: Geleceğin Diyet Planlaması',
        summary: 'Yapay zeka algoritmalarının genetik, metabolik ve yaşam tarzı verilerine dayalı kişiselleştirilmiş beslenme önerileri sunma potansiyeli.',
        content: `
          <h2>Yapay Zeka ve Beslenme Bilimi: Yeni Bir Paradigma</h2>
          
          <p>Yapay zeka teknolojileri, beslenme biliminde devrim niteliğinde değişiklikler getirmektedir. Geleneksel "tek boyut herkese uyar" yaklaşımının yerini, kişiselleştirilmiş beslenme önerileri almaktadır. 2024 yılında Nature Medicine'de yayınlanan bir araştırma, AI destekli beslenme planlarının geleneksel yöntemlere göre %30 daha etkili olduğunu göstermiştir.</p>

          <h3>AI Algoritmalarının Kullandığı Veri Kaynakları</h3>
          
          <p>Modern AI sistemleri, beslenme önerileri geliştirirken şu veri kaynaklarını kullanır:</p>

          <ul>
            <li><strong>Genetik veriler:</strong> Nutrigenetik testler ve genetik yatkınlıklar</li>
            <li><strong>Metabolik profiller:</strong> Kan değerleri, hormon seviyeleri</li>
            <li><strong>Mikrobiyota analizi:</strong> Bağırsak bakteri kompozisyonu</li>
            <li><strong>Yaşam tarzı verileri:</strong> Aktivite seviyesi, uyku kalitesi, stres</li>
            <li><strong>Beslenme geçmişi:</strong> Önceki diyet deneyimleri ve tercihler</li>
          </ul>

          <h3>Klinik Uygulamalar</h3>
          
          <p>2023 yılında Stanford Üniversitesi'nde yapılan bir çalışmada, AI destekli beslenme planları kullanılarak:</p>

          <ul>
            <li>Tip 2 diyabet hastalarında HbA1c seviyelerinde %0.8 azalma</li>
            <li>Kardiyovasküler risk faktörlerinde %25 iyileşme</li>
            <li>Hasta uyumunda %40 artış</li>
            <li>Diyetisyen randevularında %60 azalma</li>
          </ul>

          <h3>AI Destekli Beslenme Planlamasının Avantajları</h3>
          
          <ol>
            <li><strong>Kişiselleştirme:</strong> Her bireyin benzersiz ihtiyaçlarına göre plan</li>
            <li><strong>Sürekli Öğrenme:</strong> Kullanıcı verilerine göre sürekli iyileştirme</li>
            <li><strong>Gerçek Zamanlı Uyarlama:</strong> Değişen koşullara anında adaptasyon</li>
            <li><strong>Öngörücü Analitik:</strong> Gelecekteki sağlık risklerini tahmin etme</li>
            <li><strong>Ölçeklenebilirlik:</strong> Büyük popülasyonlara hizmet verebilme</li>
          </ol>

          <h3>Etik ve Güvenlik Konuları</h3>
          
          <p>AI destekli beslenme sistemlerinin yaygınlaşması ile birlikte, veri gizliliği, algoritma şeffaflığı ve klinik doğrulama konuları önem kazanmaktadır. FDA ve diğer düzenleyici kurumlar, bu teknolojilerin güvenli ve etkili kullanımı için kılavuzlar geliştirmektedir.</p>

          <h3>Gelecek Vizyonu</h3>
          
          <p>Önümüzdeki 5-10 yıl içinde, AI destekli beslenme sistemleri standart sağlık hizmetlerinin bir parçası haline gelecektir. Bu teknolojiler, önleyici tıp yaklaşımını güçlendirerek, kronik hastalıkların yükünü azaltmada önemli rol oynayacaktır.</p>
        `,
        category: 'Yapay Zeka',
        author: 'Dr. Zeynep Arslan',
        image: '/assets/blog/ai-diet.png',
        status: 'published',
        slug: 'yapay-zeka-destekli-kisisellestirilmis-beslenme',
        meta_title: 'Yapay Zeka Destekli Kişiselleştirilmiş Beslenme: Geleceğin Diyet Planlaması',
        meta_description: 'Yapay zeka algoritmalarının genetik, metabolik ve yaşam tarzı verilerine dayalı kişiselleştirilmiş beslenme önerileri sunma potansiyeli.',
        is_featured: true,
        published_at: new Date('2024-06-15')
      },
      {
        title: 'Kronik İnflamasyon ve Beslenme: Modern Hastalıkların Kökeni',
        summary: 'Kronik düşük seviyeli inflamasyonun obezite, diyabet ve kardiyovasküler hastalıklardaki rolü ve anti-inflamatuar beslenme stratejileri.',
        content: `
          <h2>Kronik İnflamasyon: Sessiz Tehlike</h2>
          
          <p>Kronik düşük seviyeli inflamasyon, modern toplumlarda yaygın olan birçok hastalığın temelinde yatan ortak mekanizmadır. Akut inflamasyon, vücudun yaralanma veya enfeksiyona karşı doğal savunma mekanizmasıdır. Ancak, sürekli devam eden inflamasyon, dokulara zarar verir ve hastalık süreçlerini tetikler.</p>

          <h3>İnflamasyonun Hastalıklarla İlişkisi</h3>
          
          <p>2023 yılında Cell dergisinde yayınlanan bir araştırma, kronik inflamasyonun şu hastalıklarla güçlü bağlantısını göstermiştir:</p>

          <ul>
            <li><strong>Obezite:</strong> Yağ dokusundaki inflamasyon, insülin direncini artırır</li>
            <li><strong>Tip 2 Diyabet:</strong> Pankreas beta hücrelerinde inflamasyon</li>
            <li><strong>Kardiyovasküler Hastalıklar:</strong> Damar duvarında aterosklerotik plak oluşumu</li>
            <li><strong>Kanser:</strong> Hücre proliferasyonu ve metastaz riskinde artış</li>
            <li><strong>Nörodejeneratif Hastalıklar:</strong> Beyin dokusunda inflamasyon</li>
          </ul>

          <h3>İnflamasyonu Tetikleyen Beslenme Faktörleri</h3>
          
          <p>Araştırmalar, şu beslenme faktörlerinin kronik inflamasyonu artırdığını göstermektedir:</p>

          <ol>
            <li><strong>Rafine Şekerler:</strong> Fruktoz, glikoz ve sakaroz</li>
            <li><strong>Trans Yağlar:</strong> Hidrojene edilmiş yağlar</li>
            <li><strong>Rafine Karbonhidratlar:</strong> Beyaz un, beyaz pirinç</li>
            <li><strong>İşlenmiş Etler:</strong> Sosis, salam, pastırma</li>
            <li><strong>Aşırı Omega-6 Yağları:</strong> Mısır, soya yağı</li>
          </ol>

          <h3>Anti-İnflamatuar Beslenme Stratejileri</h3>
          
          <p>Kronik inflamasyonu azaltmak için önerilen beslenme yaklaşımları:</p>

          <h4>1. Omega-3 Yağ Asitleri</h4>
          <p>Balık, ceviz, keten tohumu ve chia tohumu gibi omega-3 açısından zengin gıdalar, inflamasyonu azaltır.</p>

          <h4>2. Antioksidanlar</h4>
          <p>Renkli meyve ve sebzeler, polifenoller ve flavonoidler açısından zengindir.</p>

          <h4>3. Lifli Gıdalar</h4>
          <p>Tam tahıllar, baklagiller ve sebzeler, bağırsak sağlığını destekler.</p>

          <h4>4. Fermente Gıdalar</h4>
          <p>Yoğurt, kefir, lahana turşusu gibi probiyotik açısından zengin gıdalar.</p>

          <h3>Klinik Kanıtlar</h3>
          
          <p>2024 yılında Journal of Nutrition'da yayınlanan bir meta-analiz, anti-inflamatuar diyetin:</p>

          <ul>
            <li>CRP (C-reaktif protein) seviyelerinde %25 azalma</li>
            <li>IL-6 (interlökin-6) seviyelerinde %30 azalma</li>
            <li>Kardiyovasküler risk faktörlerinde %20 iyileşme</li>
            <li>Genel mortalite riskinde %15 azalma</li>
          </ul>

          <h3>Pratik Uygulama</h3>
          
          <p>Anti-inflamatuar beslenme için günlük öneriler:</p>

          <ul>
            <li>Günde 5-7 porsiyon renkli meyve ve sebze</li>
            <li>Haftada 2-3 porsiyon yağlı balık</li>
            <li>Günde 25-30 gram lif</li>
            <li>Zeytinyağı ve avokado gibi sağlıklı yağlar</li>
            <li>Şeker ve işlenmiş gıdalardan kaçınma</li>
          </ul>
        `,
        category: 'İnflamasyon',
        author: 'Dr. Can Özkan',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        status: 'published',
        slug: 'kronik-inflamasyon-ve-beslenme',
        meta_title: 'Kronik İnflamasyon ve Beslenme: Modern Hastalıkların Kökeni',
        meta_description: 'Kronik düşük seviyeli inflamasyonun obezite, diyabet ve kardiyovasküler hastalıklardaki rolü ve anti-inflamatuar beslenme stratejileri.',
        is_featured: false,
        published_at: new Date('2024-06-12')
      },
      {
        title: 'Sirkadiyen Ritim ve Beslenme: Zamanlanmış Beslenmenin Bilimsel Temelleri',
        summary: 'Vücudun biyolojik saatinin metabolizma üzerindeki etkileri ve zamanlanmış beslenme stratejilerinin sağlık üzerindeki etkileri.',
        content: `
          <h2>Sirkadiyen Ritim: Vücudumuzun İç Saati</h2>
          
          <p>Sirkadiyen ritim, 24 saatlik döngülerde tekrarlanan biyolojik süreçlerdir. Bu ritim, sadece uyku-uyanıklık döngüsünü değil, aynı zamanda metabolizma, hormon salınımı ve beslenme davranışlarını da kontrol eder. 2023 yılında Cell Metabolism'de yayınlanan bir araştırma, sirkadiyen ritim bozukluklarının metabolik hastalıklarla güçlü bağlantısını göstermiştir.</p>

          <h3>Metabolik Saat Genleri</h3>
          
          <p>Vücudumuzda metabolik süreçleri kontrol eden ana saat genleri şunlardır:</p>

          <ul>
            <li><strong>CLOCK:</strong> Merkezi sirkadiyen düzenleyici</li>
            <li><strong>BMAL1:</strong> Metabolik genlerin ekspresyonunu kontrol eder</li>
            <li><strong>PER1/2/3:</strong> Sirkadiyen ritmi baskılar</li>
            <li><strong>CRY1/2:</strong> Sirkadiyen ritmi düzenler</li>
            <li><strong>REV-ERBα:</strong> Lipid metabolizmasını kontrol eder</li>
          </ul>

          <h3>Zamanlanmış Beslenme (Time-Restricted Feeding)</h3>
          
          <p>Zamanlanmış beslenme, günlük beslenme penceresini sınırlayarak sirkadiyen ritmi destekleyen bir beslenme stratejisidir. 2024 yılında Nature Reviews Endocrinology'de yayınlanan bir meta-analiz, 8-10 saatlik beslenme penceresinin şu faydaları sağladığını göstermiştir:</p>

          <ul>
            <li>Vücut ağırlığında %3-5 azalma</li>
            <li>İnsülin duyarlılığında %20 iyileşme</li>
            <li>Kardiyovasküler risk faktörlerinde %15 azalma</li>
            <li>Uyku kalitesinde %25 iyileşme</li>
            <li>Enerji seviyesinde %30 artış</li>
          </ul>

          <h3>Optimal Beslenme Zamanları</h3>
          
          <h4>Sabah (06:00-10:00)</h4>
          <p>Kortizol seviyelerinin yüksek olduğu bu dönemde, protein ve kompleks karbonhidratlar tercih edilmelidir. Yumurta, tam tahıllı ekmek ve meyve ideal seçeneklerdir.</p>

          <h4>Öğle (12:00-14:00)</h4>
          <p>Metabolizmanın en aktif olduğu dönemde, ana öğün tüketilmelidir. Protein, sebze ve sağlıklı yağlar içeren dengeli bir öğün.</p>

          <h4>Akşam (18:00-20:00)</h4>
          <p>Metabolizmanın yavaşladığı dönemde, hafif ve sindirimi kolay gıdalar tercih edilmelidir. Sebze ağırlıklı öğünler ideal.</p>

          <h3>Gece Yemek Yeme ve Metabolik Sağlık</h3>
          
          <p>Gece geç saatlerde yemek yeme, sirkadiyen ritmi bozar ve metabolik sağlığı olumsuz etkiler. 2023 yılında Journal of Clinical Endocrinology & Metabolism'de yayınlanan bir çalışma:</p>

          <ul>
            <li>Gece yemek yemenin glikoz toleransını %18 azalttığını</li>
            <li>İnsülin direncini %25 artırdığını</li>
            <li>Uyku kalitesini %30 azalttığını</li>
            <li>Kilo alımı riskini %40 artırdığını göstermiştir</li>
          </ul>

          <h3>Pratik Öneriler</h3>
          
          <ol>
            <li><strong>Kahvaltıyı atlamayın:</strong> Güne protein açısından zengin bir kahvaltı ile başlayın</li>
            <li><strong>Öğle öğününü güçlendirin:</strong> Günün en büyük öğünü öğle olsun</li>
            <li><strong>Akşam yemeğini hafif tutun:</strong> Akşam 19:00'dan sonra yemek yemeyin</li>
            <li><strong>Düzenli uyku:</strong> Her gün aynı saatte yatın ve kalkın</li>
            <li><strong>Işık maruziyetini kontrol edin:</strong> Akşam mavi ışık maruziyetini azaltın</li>
          </ol>

          <h3>Klinik Uygulamalar</h3>
          
          <p>Zamanlanmış beslenme, özellikle şu durumlarda etkilidir:</p>

          <ul>
            <li>Metabolik sendrom</li>
            <li>Tip 2 diyabet</li>
            <li>Obezite</li>
            <li>Kardiyovasküler hastalıklar</li>
            <li>Uyku bozuklukları</li>
          </ul>

          <h3>Sonuç</h3>
          
          <p>Sirkadiyen ritim ve beslenme arasındaki ilişki, sağlıklı yaşam için kritik öneme sahiptir. Zamanlanmış beslenme stratejileri, metabolik sağlığı iyileştirerek kronik hastalık riskini azaltabilir.</p>
        `,
        category: 'Kronobiyoloji',
        author: 'Dr. Elif Yıldız',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        status: 'published',
        slug: 'sirkadiyen-ritim-ve-beslenme',
        meta_title: 'Sirkadiyen Ritim ve Beslenme: Zamanlanmış Beslenmenin Bilimsel Temelleri',
        meta_description: 'Vücudun biyolojik saatinin metabolizma üzerindeki etkileri ve zamanlanmış beslenme stratejilerinin sağlık üzerindeki etkileri.',
        is_featured: false,
        published_at: new Date('2024-06-10')
      }
    ];

    const insertedBlogs = await db.insert(blogs).values(blogData).returning();
    console.log(`✅ Added ${insertedBlogs.length} blog posts`);

    console.log('🎉 Blog seeding completed successfully!');
    console.log('✅ Seeding completed');
  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    throw error;
  }
}

// Run the seeding function
seedBlogs().catch(console.error); 