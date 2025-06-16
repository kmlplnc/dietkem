import { pgTable, serial, varchar, timestamp, integer, decimal, text, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'subscriber_basic',
  'subscriber_pro',
  'clinic_admin',
  'dietitian_team_member',
  'admin',
  'superadmin'
]);

export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerk_id: varchar('clerk_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('subscriber_basic'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Clients table
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 50 }),
  birth_date: timestamp('birth_date'),
  height_cm: decimal('height_cm', { precision: 5, scale: 2 }),
  weight_kg: decimal('weight_kg', { precision: 5, scale: 2 }),
  goal: text('goal'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Measurements table
export const measurements = pgTable('measurements', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').references(() => clients.id).notNull(),
  date: timestamp('date').notNull(),
  weight_kg: decimal('weight_kg', { precision: 5, scale: 2 }).notNull(),
  waist_cm: decimal('waist_cm', { precision: 5, scale: 2 }),
  body_fat_percent: decimal('body_fat_percent', { precision: 4, scale: 2 }),
});

// Meal plans table
export const meal_plans = pgTable('meal_plans', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').references(() => clients.id).notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  total_calories: integer('total_calories').notNull(),
  notes: text('notes'),
  created_by: integer('created_by').references(() => users.id).notNull(),
});

// Meal plan days table
export const meal_plan_days = pgTable('meal_plan_days', {
  id: serial('id').primaryKey(),
  meal_plan_id: integer('meal_plan_id').references(() => meal_plans.id).notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
});

// Meals table
export const meals = pgTable('meals', {
  id: serial('id').primaryKey(),
  meal_plan_day_id: integer('meal_plan_day_id').references(() => meal_plan_days.id).notNull(),
  meal_type: mealTypeEnum('meal_type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  calories: integer('calories').notNull(),
  protein_g: decimal('protein_g', { precision: 5, scale: 2 }).notNull(),
  carbs_g: decimal('carbs_g', { precision: 5, scale: 2 }).notNull(),
  fat_g: decimal('fat_g', { precision: 5, scale: 2 }).notNull(),
  description: text('description'),
});

// Foods table
export const foods = pgTable('foods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  calories_per_100g: integer('calories_per_100g').notNull(),
  protein_per_100g: decimal('protein_per_100g', { precision: 5, scale: 2 }).notNull(),
  carbs_per_100g: decimal('carbs_per_100g', { precision: 5, scale: 2 }).notNull(),
  fat_per_100g: decimal('fat_per_100g', { precision: 5, scale: 2 }).notNull(),
  locale: varchar('locale', { length: 10 }).notNull().default('en'),
});

// Water logs table
export const water_logs = pgTable('water_logs', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').references(() => clients.id).notNull(),
  date: timestamp('date').notNull(),
  value_liters: decimal('value_liters', { precision: 4, scale: 2 }).notNull(),
});

// Weight logs table
export const weight_logs = pgTable('weight_logs', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').references(() => clients.id).notNull(),
  date: timestamp('date').notNull(),
  weight_kg: decimal('weight_kg', { precision: 5, scale: 2 }).notNull(),
}); 