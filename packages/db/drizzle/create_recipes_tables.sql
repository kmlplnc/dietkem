-- Create recipes tables
-- Based on the schema definition in packages/db/schema/recipes.ts

-- Tarifler tablosu
CREATE TABLE IF NOT EXISTS recipes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  ready_in_minutes INTEGER,
  servings INTEGER,
  difficulty TEXT, -- 'Kolay', 'Orta', 'Zor'
  cuisine TEXT, -- 'Türk', 'İtalyan', 'Çin', vb.
  dish_type TEXT, -- 'Ana Yemek', 'Çorba', 'Salata', vb.
  instructions TEXT, -- HTML formatında hazırlanış talimatları
  created_by INTEGER REFERENCES users(id),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Malzemeler tablosu
CREATE TABLE IF NOT EXISTS ingredients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT, -- 'g', 'kg', 'adet', 'su bardağı', vb.
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarif malzemeleri (many-to-many ilişki)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  ingredient_id INTEGER REFERENCES ingredients(id) NOT NULL,
  amount INTEGER NOT NULL,
  notes TEXT -- Ek notlar
);

-- Besin değerleri tablosu
CREATE TABLE IF NOT EXISTS nutrition_info (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  calories INTEGER,
  protein INTEGER,
  carbohydrates INTEGER,
  fat INTEGER,
  fiber INTEGER,
  sugar INTEGER,
  sodium INTEGER
);

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Emoji veya icon
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarif kategorileri (many-to-many ilişki)
CREATE TABLE IF NOT EXISTS recipe_categories (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  category_id INTEGER REFERENCES categories(id) NOT NULL
);

-- Favori tarifler
CREATE TABLE IF NOT EXISTS favorite_recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarif değerlendirmeleri
CREATE TABLE IF NOT EXISTS recipe_ratings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  rating INTEGER NOT NULL, -- 1-5 arası
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarif görüntülenme sayısı
CREATE TABLE IF NOT EXISTS recipe_views (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER REFERENCES recipes(id) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  viewed_at TIMESTAMP DEFAULT NOW()
); 