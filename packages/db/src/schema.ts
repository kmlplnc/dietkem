import { pgTable, serial, varchar, timestamp, integer, decimal, text, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'subscriber_basic',
  'subscriber_pro',
  'clinic_admin',
  'dietitian_team_member',
  'admin',
  'superadmin',
]);

export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  clerk_id: varchar('clerk_id', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: userRoleEnum('role').notNull().default('subscriber_basic'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
  username: varchar('username', { length: 255 }),
  avatar_url: varchar('avatar_url', { length: 512 }).default('https://res.cloudinary.com/dietkem/image/upload/v1/avatar.jpg'),
  trial_started_at: timestamp('trial_started_at'),
  trial_used: text('trial_used').default('false'),
  first_subscription_started_at: timestamp('first_subscription_started_at'),
});

// Email verification codes table
export const emailVerificationCodes = pgTable('email_verification_codes', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  code: varchar('code', { length: 6 }).notNull(),
  expires_at: timestamp('expires_at').notNull(),
  used: text('used').default('false'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// NextAuth session tables
export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  sessionToken: varchar('session_token', { length: 255 }).notNull().unique(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
});

export const accounts = pgTable('accounts', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: serial('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
});

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
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