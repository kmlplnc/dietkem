import { db } from '../src';
import { sql } from 'drizzle-orm';

async function recreateTables() {
  try {
    // Create meal_type enum
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE meal_type AS ENUM('breakfast', 'lunch', 'dinner', 'snack');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create clients table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        gender VARCHAR(50),
        birth_date TIMESTAMP,
        height_cm NUMERIC(5, 2),
        weight_kg NUMERIC(5, 2),
        goal TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      );
    `);

    // Create measurements table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS measurements (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        date TIMESTAMP NOT NULL,
        weight_kg NUMERIC(5, 2) NOT NULL,
        waist_cm NUMERIC(5, 2),
        body_fat_percent NUMERIC(4, 2)
      );
    `);

    // Create meal_plans table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meal_plans (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        total_calories INTEGER NOT NULL,
        notes TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    // Create meal_plan_days table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meal_plan_days (
        id SERIAL PRIMARY KEY,
        meal_plan_id INTEGER NOT NULL REFERENCES meal_plans(id),
        date TIMESTAMP NOT NULL,
        notes TEXT
      );
    `);

    // Create meals table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS meals (
        id SERIAL PRIMARY KEY,
        meal_plan_day_id INTEGER NOT NULL REFERENCES meal_plan_days(id),
        meal_type meal_type NOT NULL,
        name VARCHAR(255) NOT NULL,
        calories INTEGER NOT NULL,
        protein_g NUMERIC(5, 2) NOT NULL,
        carbs_g NUMERIC(5, 2) NOT NULL,
        fat_g NUMERIC(5, 2) NOT NULL,
        description TEXT
      );
    `);

    // Create foods table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS foods (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        calories_per_100g INTEGER NOT NULL,
        protein_per_100g NUMERIC(5, 2) NOT NULL,
        carbs_per_100g NUMERIC(5, 2) NOT NULL,
        fat_per_100g NUMERIC(5, 2) NOT NULL,
        locale VARCHAR(10) DEFAULT 'en' NOT NULL
      );
    `);

    // Create water_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS water_logs (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        date TIMESTAMP NOT NULL,
        value_liters NUMERIC(4, 2) NOT NULL
      );
    `);

    // Create weight_logs table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS weight_logs (
        id SERIAL PRIMARY KEY,
        client_id INTEGER NOT NULL REFERENCES clients(id),
        date TIMESTAMP NOT NULL,
        weight_kg NUMERIC(5, 2) NOT NULL
      );
    `);

    console.log('All tables recreated successfully!');
  } catch (error) {
    console.error('Error recreating tables:', error);
  } finally {
    process.exit(0);
  }
}

recreateTables(); 