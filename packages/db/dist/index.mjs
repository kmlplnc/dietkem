var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// src/schema.ts
var schema_exports = {};
__export(schema_exports, {
  clients: () => clients,
  foods: () => foods,
  mealTypeEnum: () => mealTypeEnum,
  meal_plan_days: () => meal_plan_days,
  meal_plans: () => meal_plans,
  meals: () => meals,
  measurements: () => measurements,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  water_logs: () => water_logs,
  weight_logs: () => weight_logs
});
import { pgTable, serial, varchar, timestamp, integer, decimal, text, pgEnum } from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["dietitian", "client"]);
var mealTypeEnum = pgEnum("meal_type", ["breakfast", "lunch", "dinner", "snack"]);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password_hash: varchar("password_hash", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull()
});
var clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  gender: varchar("gender", { length: 50 }),
  birth_date: timestamp("birth_date"),
  height_cm: decimal("height_cm", { precision: 5, scale: 2 }),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }),
  goal: text("goal"),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull()
});
var measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").references(() => clients.id).notNull(),
  date: timestamp("date").notNull(),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }).notNull(),
  waist_cm: decimal("waist_cm", { precision: 5, scale: 2 }),
  body_fat_percent: decimal("body_fat_percent", { precision: 4, scale: 2 })
});
var meal_plans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").references(() => clients.id).notNull(),
  start_date: timestamp("start_date").notNull(),
  end_date: timestamp("end_date").notNull(),
  total_calories: integer("total_calories").notNull(),
  notes: text("notes"),
  created_by: integer("created_by").references(() => users.id).notNull()
});
var meal_plan_days = pgTable("meal_plan_days", {
  id: serial("id").primaryKey(),
  meal_plan_id: integer("meal_plan_id").references(() => meal_plans.id).notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes")
});
var meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  meal_plan_day_id: integer("meal_plan_day_id").references(() => meal_plan_days.id).notNull(),
  meal_type: mealTypeEnum("meal_type").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  calories: integer("calories").notNull(),
  protein_g: decimal("protein_g", { precision: 5, scale: 2 }).notNull(),
  carbs_g: decimal("carbs_g", { precision: 5, scale: 2 }).notNull(),
  fat_g: decimal("fat_g", { precision: 5, scale: 2 }).notNull(),
  description: text("description")
});
var foods = pgTable("foods", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  calories_per_100g: integer("calories_per_100g").notNull(),
  protein_per_100g: decimal("protein_per_100g", { precision: 5, scale: 2 }).notNull(),
  carbs_per_100g: decimal("carbs_per_100g", { precision: 5, scale: 2 }).notNull(),
  fat_per_100g: decimal("fat_per_100g", { precision: 5, scale: 2 }).notNull(),
  locale: varchar("locale", { length: 10 }).notNull().default("en")
});
var water_logs = pgTable("water_logs", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").references(() => clients.id).notNull(),
  date: timestamp("date").notNull(),
  value_liters: decimal("value_liters", { precision: 4, scale: 2 }).notNull()
});
var weight_logs = pgTable("weight_logs", {
  id: serial("id").primaryKey(),
  client_id: integer("client_id").references(() => clients.id).notNull(),
  date: timestamp("date").notNull(),
  weight_kg: decimal("weight_kg", { precision: 5, scale: 2 }).notNull()
});

// src/index.ts
var connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dietkem";
var queryClient = postgres(connectionString);
var db = drizzle(queryClient, { schema: schema_exports });
export {
  clients,
  db,
  foods,
  mealTypeEnum,
  meal_plan_days,
  meal_plans,
  meals,
  measurements,
  queryClient,
  userRoleEnum,
  users,
  water_logs,
  weight_logs
};
//# sourceMappingURL=index.mjs.map