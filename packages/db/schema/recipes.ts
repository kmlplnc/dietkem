import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

// Tarifler tablosu
export const recipes = pgTable('recipes', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  image_url: text('image_url'),
  ready_in_minutes: integer('ready_in_minutes'),
  servings: integer('servings'),
  difficulty: text('difficulty'), // 'Kolay', 'Orta', 'Zor'
  cuisine: text('cuisine'), // 'Türk', 'İtalyan', 'Çin', vb.
  dish_type: text('dish_type'), // 'Ana Yemek', 'Çorba', 'Salata', vb.
  instructions: text('instructions'), // HTML formatında hazırlanış talimatları
  created_by: integer('created_by').references(() => users.id),
  is_public: boolean('is_public').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Malzemeler tablosu
export const ingredients = pgTable('ingredients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  unit: text('unit'), // 'g', 'kg', 'adet', 'su bardağı', vb.
  created_at: timestamp('created_at').defaultNow(),
});

// Tarif malzemeleri (many-to-many ilişki)
export const recipe_ingredients = pgTable('recipe_ingredients', {
  id: serial('id').primaryKey(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  ingredient_id: integer('ingredient_id').references(() => ingredients.id).notNull(),
  amount: integer('amount').notNull(),
  notes: text('notes'), // Ek notlar
});

// Besin değerleri tablosu
export const nutrition_info = pgTable('nutrition_info', {
  id: serial('id').primaryKey(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  calories: integer('calories'),
  protein: integer('protein'),
  carbohydrates: integer('carbohydrates'),
  fat: integer('fat'),
  fiber: integer('fiber'),
  sugar: integer('sugar'),
  sodium: integer('sodium'),
});

// Kategoriler tablosu
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'), // Emoji veya icon
  created_at: timestamp('created_at').defaultNow(),
});

// Tarif kategorileri (many-to-many ilişki)
export const recipe_categories = pgTable('recipe_categories', {
  id: serial('id').primaryKey(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  category_id: integer('category_id').references(() => categories.id).notNull(),
});

// Favori tarifler
export const favorite_recipes = pgTable('favorite_recipes', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Tarif değerlendirmeleri
export const recipe_ratings = pgTable('recipe_ratings', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  rating: integer('rating').notNull(), // 1-5 arası
  comment: text('comment'),
  created_at: timestamp('created_at').defaultNow(),
});

// Tarif görüntülenme sayısı
export const recipe_views = pgTable('recipe_views', {
  id: serial('id').primaryKey(),
  recipe_id: integer('recipe_id').references(() => recipes.id).notNull(),
  user_id: integer('user_id').references(() => users.id),
  viewed_at: timestamp('viewed_at').defaultNow(),
});

// TypeScript tipleri
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
export type RecipeIngredient = typeof recipe_ingredients.$inferSelect;
export type NewRecipeIngredient = typeof recipe_ingredients.$inferInsert;
export type NutritionInfo = typeof nutrition_info.$inferSelect;
export type NewNutritionInfo = typeof nutrition_info.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type FavoriteRecipe = typeof favorite_recipes.$inferSelect;
export type NewFavoriteRecipe = typeof favorite_recipes.$inferInsert;
export type RecipeRating = typeof recipe_ratings.$inferSelect;
export type NewRecipeRating = typeof recipe_ratings.$inferInsert; 