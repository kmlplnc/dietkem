import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './router';
import { createContext } from './context';
import nextAuthHandler from './auth';
import bcrypt from 'bcryptjs';
import { db } from '@dietkem/db';
import { users } from '@dietkem/db/src/schema';
import { eq } from 'drizzle-orm';
import recipesRouter from './routers/recipes';
import jwt from 'jsonwebtoken';

// Debug environment variables
console.log('Environment variables:', {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set'
});

const app = express();

// Enable CORS with specific origins for development
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001', 
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://localhost:4173',
  'https://dietkem-web.onrender.com',
  'https://dietkem.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and network IP addresses for development
    if (allowedOrigins.indexOf(origin) !== -1 || 
        origin.startsWith('http://192.168.') ||
        origin.startsWith('http://10.') ||
        origin.startsWith('http://172.') ||
        origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// tRPC health check endpoint
app.get('/trpc', (req, res) => {
  res.json({ 
    status: 'tRPC endpoint is working',
    timestamp: new Date().toISOString(),
    availableProcedures: Object.keys(appRouter._def.procedures)
  });
});

// NextAuth.js route
app.use('/api/auth', (req, res, next) => {
  // NextAuth expects req.query, req.body, req.cookies
  // Express 4.x+ parses query and body by default
  return nextAuthHandler(req, res);
});

// Register endpoint
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Direct login endpoint for fallback
app.post('/api/auth/login', async (req, res) => {
  console.log('=== Direct login endpoint called ===');
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  const { email, password } = req.body;
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ error: 'Missing email or password' });
  }
  
  try {
    console.log('Direct login attempt for:', email);
    
    // Find user by email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log('User found:', user ? 'Yes' : 'No');

    if (!user || !user.password) {
      console.log('Invalid user or password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      NEXTAUTH_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Direct login successful for:', email);
    console.log('Generated token length:', token.length);

    const response = {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
      token,
    };

    console.log('Sending response:', JSON.stringify(response, null, 2));
    return res.json(response);
  } catch (error) {
    console.error('Direct login error:', error);
    return res.status(500).json({ 
      error: 'Login failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    const [user] = await db.insert(users).values({
      email,
      password: hashed,
      first_name: firstName,
      last_name: lastName,
      role: 'subscriber_basic',
    }).returning();
    return res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// Recipes routes
app.use('/api/recipes', recipesRouter);

// Blog endpoints for direct API access
app.get('/api/blogs', (req, res) => {
  // Bilimsel blog yazıları
  const samplePosts: any[] = [
    {
      id: '1',
      title: 'Bağırsak Mikrobiyotası ve Metabolik Sağlık: Bilimsel Kanıtlar',
      summary: 'Bağırsak bakterilerinin metabolizma, kilo kontrolü ve genel sağlık üzerindeki etkilerini inceleyen güncel araştırmalar.',
      category: 'Bilimsel Araştırma',
      author: 'Dr. Ayşe Kaya',
      date: '2024-06-20',
      image: '/assets/blog/microbiome.png',
      status: 'published',
      content: 'Bağırsak mikrobiyotası, metabolik sağlığımızın merkezinde yer almaktadır. Doğru beslenme alışkanlıkları ve yaşam tarzı değişiklikleri ile mikrobiyotamızı destekleyerek daha sağlıklı bir metabolizma elde edebiliriz.'
    },
    {
      id: '2',
      title: 'Dijital Teknolojiler ve Beslenme Takibi: Akıllı Uygulamaların Bilimsel Etkinliği',
      summary: 'Dijital beslenme takip uygulamalarının kilo kontrolü ve sağlıklı beslenme alışkanlıkları üzerindeki etkilerini inceleyen klinik çalışmalar.',
      category: 'Dijital Sağlık',
      author: 'Dr. Mehmet Demir',
      date: '2024-06-18',
      image: '/assets/blog/digital-diet.png',
      status: 'published',
      content: 'Dijital beslenme takip uygulamaları, kullanıcılara anında geri bildirim sağlar ve davranış değişikliğini destekler. Yapay zeka ve makine öğrenmesi teknolojilerinin gelişmesi ile bu uygulamalar daha da akıllı hale gelmektedir.'
    },
    {
      id: '3',
      title: 'Yapay Zeka Destekli Kişiselleştirilmiş Beslenme: Geleceğin Diyet Planlaması',
      summary: 'Yapay zeka algoritmalarının genetik, metabolik ve yaşam tarzı verilerine dayalı kişiselleştirilmiş beslenme önerileri sunma potansiyeli.',
      category: 'Yapay Zeka',
      author: 'Dr. Zeynep Arslan',
      date: '2024-06-15',
      image: '/assets/blog/ai-diet.png',
      status: 'published',
      content: 'Yapay zeka teknolojileri, beslenme biliminde devrim niteliğinde değişiklikler getirmektedir. Geleneksel "tek boyut herkese uyar" yaklaşımının yerini, kişiselleştirilmiş beslenme önerileri almaktadır.'
    },
    {
      id: '4',
      title: 'Kronik İnflamasyon ve Beslenme: Modern Hastalıkların Kökeni',
      summary: 'Kronik düşük seviyeli inflamasyonun obezite, diyabet ve kardiyovasküler hastalıklardaki rolü ve anti-inflamatuar beslenme stratejileri.',
      category: 'İnflamasyon',
      author: 'Dr. Can Özkan',
      date: '2024-06-12',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      status: 'published',
      content: 'Kronik düşük seviyeli inflamasyon, modern toplumlarda yaygın olan birçok hastalığın temelinde yatan ortak mekanizmadır. Anti-inflamatuar beslenme stratejileri ile bu riski azaltabiliriz.'
    },
    {
      id: '5',
      title: 'Sirkadiyen Ritim ve Beslenme: Zamanlanmış Beslenmenin Bilimsel Temelleri',
      summary: 'Vücudun biyolojik saatinin metabolizma üzerindeki etkileri ve zamanlanmış beslenme stratejilerinin sağlık üzerindeki etkileri.',
      category: 'Kronobiyoloji',
      author: 'Dr. Elif Yıldız',
      date: '2024-06-10',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      status: 'published',
      content: 'Sirkadiyen ritim, 24 saatlik döngülerde tekrarlanan biyolojik süreçlerdir. Zamanlanmış beslenme stratejileri, metabolik sağlığı iyileştirerek kronik hastalık riskini azaltabilir.'
    }
  ];
  
  res.json(samplePosts);
});

app.get('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  
  // Bilimsel blog yazıları
  const samplePosts: any[] = [
    {
      id: '1',
      title: 'Bağırsak Mikrobiyotası ve Metabolik Sağlık: Bilimsel Kanıtlar',
      summary: 'Bağırsak bakterilerinin metabolizma, kilo kontrolü ve genel sağlık üzerindeki etkilerini inceleyen güncel araştırmalar.',
      category: 'Bilimsel Araştırma',
      author: 'Dr. Ayşe Kaya',
      date: '2024-06-20',
      image: '/assets/blog/microbiome.png',
      status: 'published',
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
      `
    },
    {
      id: '2',
      title: 'Dijital Teknolojiler ve Beslenme Takibi: Akıllı Uygulamaların Bilimsel Etkinliği',
      summary: 'Dijital beslenme takip uygulamalarının kilo kontrolü ve sağlıklı beslenme alışkanlıkları üzerindeki etkilerini inceleyen klinik çalışmalar.',
      category: 'Dijital Sağlık',
      author: 'Dr. Mehmet Demir',
      date: '2024-06-18',
      image: '/assets/blog/digital-diet.png',
      status: 'published',
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
      `
    },
    {
      id: '3',
      title: 'Yapay Zeka Destekli Kişiselleştirilmiş Beslenme: Geleceğin Diyet Planlaması',
      summary: 'Yapay zeka algoritmalarının genetik, metabolik ve yaşam tarzı verilerine dayalı kişiselleştirilmiş beslenme önerileri sunma potansiyeli.',
      category: 'Yapay Zeka',
      author: 'Dr. Zeynep Arslan',
      date: '2024-06-15',
      image: '/assets/blog/ai-diet.png',
      status: 'published',
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
      `
    },
    {
      id: '4',
      title: 'Kronik İnflamasyon ve Beslenme: Modern Hastalıkların Kökeni',
      summary: 'Kronik düşük seviyeli inflamasyonun obezite, diyabet ve kardiyovasküler hastalıklardaki rolü ve anti-inflamatuar beslenme stratejileri.',
      category: 'İnflamasyon',
      author: 'Dr. Can Özkan',
      date: '2024-06-12',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      status: 'published',
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
      `
    },
    {
      id: '5',
      title: 'Sirkadiyen Ritim ve Beslenme: Zamanlanmış Beslenmenin Bilimsel Temelleri',
      summary: 'Vücudun biyolojik saatinin metabolizma üzerindeki etkileri ve zamanlanmış beslenme stratejilerinin sağlık üzerindeki etkileri.',
      category: 'Kronobiyoloji',
      author: 'Dr. Elif Yıldız',
      date: '2024-06-10',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      status: 'published',
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
      `
    }
  ];
  
  const post = samplePosts.find(post => post.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found' });
  }
  
  res.json(post);
});

// Create tRPC middleware with better error handling
const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext,
  onError: ({ error, type, path, input, ctx, req }) => {
    console.error('tRPC error:', { 
      error: error.message, 
      code: error.code,
      type, 
      path, 
      input,
      url: req.url,
      method: req.method,
      headers: req.headers
    });
    
    if (error.code === 'UNAUTHORIZED') {
      return {
        status: 401,
        body: { error: 'Unauthorized' }
      };
    }
    
    return {
      status: 500,
      body: { error: 'Internal server error', message: error.message }
    };
  }
});

// Use tRPC middleware
app.use('/trpc', trpcMiddleware);

// Add a simple test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API server is running!', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API server listening on port ${PORT}`);
  console.log(`Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`tRPC endpoint: http://0.0.0.0:${PORT}/trpc`);
  console.log(`Network access: http://[YOUR_IP]:${PORT}`);
}); 