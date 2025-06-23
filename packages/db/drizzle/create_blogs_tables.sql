-- Create blog tables
-- Based on the schema definition in packages/db/schema/blogs.ts

-- Blog yazıları tablosu
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  image TEXT,
  status TEXT DEFAULT 'pending',
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  slug TEXT UNIQUE
);

-- Blog kategorileri tablosu
CREATE TABLE IF NOT EXISTS blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog etiketleri tablosu
CREATE TABLE IF NOT EXISTS blog_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Blog-etiket ilişki tablosu (many-to-many)
CREATE TABLE IF NOT EXISTS blog_tag_relations (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) NOT NULL,
  tag_id INTEGER REFERENCES blog_tags(id) NOT NULL
);

-- Blog görüntülenme istatistikleri
CREATE TABLE IF NOT EXISTS blog_views (
  id SERIAL PRIMARY KEY,
  blog_id INTEGER REFERENCES blogs(id) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT NOW()
); 