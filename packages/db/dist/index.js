"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  clients: () => clients,
  db: () => db,
  foods: () => foods,
  mealTypeEnum: () => mealTypeEnum,
  meal_plan_days: () => meal_plan_days,
  meal_plans: () => meal_plans,
  meals: () => meals,
  measurements: () => measurements,
  queryClient: () => queryClient,
  userRoleEnum: () => userRoleEnum,
  users: () => users,
  water_logs: () => water_logs,
  weight_logs: () => weight_logs
});
module.exports = __toCommonJS(index_exports);
var import_postgres_js = require("drizzle-orm/postgres-js");
var import_postgres = __toESM(require("postgres"));

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
var import_pg_core = require("drizzle-orm/pg-core");
var userRoleEnum = (0, import_pg_core.pgEnum)("user_role", ["dietitian", "client"]);
var mealTypeEnum = (0, import_pg_core.pgEnum)("meal_type", ["breakfast", "lunch", "dinner", "snack"]);
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  clerk_id: (0, import_pg_core.varchar)("clerk_id", { length: 255 }).notNull().unique(),
  email: (0, import_pg_core.varchar)("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").notNull(),
  created_at: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull(),
  updated_at: (0, import_pg_core.timestamp)("updated_at").defaultNow().notNull()
});
var clients = (0, import_pg_core.pgTable)("clients", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  user_id: (0, import_pg_core.integer)("user_id").references(() => users.id).notNull(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  gender: (0, import_pg_core.varchar)("gender", { length: 50 }),
  birth_date: (0, import_pg_core.timestamp)("birth_date"),
  height_cm: (0, import_pg_core.decimal)("height_cm", { precision: 5, scale: 2 }),
  weight_kg: (0, import_pg_core.decimal)("weight_kg", { precision: 5, scale: 2 }),
  goal: (0, import_pg_core.text)("goal"),
  notes: (0, import_pg_core.text)("notes"),
  created_at: (0, import_pg_core.timestamp)("created_at").defaultNow().notNull()
});
var measurements = (0, import_pg_core.pgTable)("measurements", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  client_id: (0, import_pg_core.integer)("client_id").references(() => clients.id).notNull(),
  date: (0, import_pg_core.timestamp)("date").notNull(),
  weight_kg: (0, import_pg_core.decimal)("weight_kg", { precision: 5, scale: 2 }).notNull(),
  waist_cm: (0, import_pg_core.decimal)("waist_cm", { precision: 5, scale: 2 }),
  body_fat_percent: (0, import_pg_core.decimal)("body_fat_percent", { precision: 4, scale: 2 })
});
var meal_plans = (0, import_pg_core.pgTable)("meal_plans", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  client_id: (0, import_pg_core.integer)("client_id").references(() => clients.id).notNull(),
  start_date: (0, import_pg_core.timestamp)("start_date").notNull(),
  end_date: (0, import_pg_core.timestamp)("end_date").notNull(),
  total_calories: (0, import_pg_core.integer)("total_calories").notNull(),
  notes: (0, import_pg_core.text)("notes"),
  created_by: (0, import_pg_core.integer)("created_by").references(() => users.id).notNull()
});
var meal_plan_days = (0, import_pg_core.pgTable)("meal_plan_days", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  meal_plan_id: (0, import_pg_core.integer)("meal_plan_id").references(() => meal_plans.id).notNull(),
  date: (0, import_pg_core.timestamp)("date").notNull(),
  notes: (0, import_pg_core.text)("notes")
});
var meals = (0, import_pg_core.pgTable)("meals", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  meal_plan_day_id: (0, import_pg_core.integer)("meal_plan_day_id").references(() => meal_plan_days.id).notNull(),
  meal_type: mealTypeEnum("meal_type").notNull(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  calories: (0, import_pg_core.integer)("calories").notNull(),
  protein_g: (0, import_pg_core.decimal)("protein_g", { precision: 5, scale: 2 }).notNull(),
  carbs_g: (0, import_pg_core.decimal)("carbs_g", { precision: 5, scale: 2 }).notNull(),
  fat_g: (0, import_pg_core.decimal)("fat_g", { precision: 5, scale: 2 }).notNull(),
  description: (0, import_pg_core.text)("description")
});
var foods = (0, import_pg_core.pgTable)("foods", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  name: (0, import_pg_core.varchar)("name", { length: 255 }).notNull(),
  description: (0, import_pg_core.text)("description"),
  calories_per_100g: (0, import_pg_core.integer)("calories_per_100g").notNull(),
  protein_per_100g: (0, import_pg_core.decimal)("protein_per_100g", { precision: 5, scale: 2 }).notNull(),
  carbs_per_100g: (0, import_pg_core.decimal)("carbs_per_100g", { precision: 5, scale: 2 }).notNull(),
  fat_per_100g: (0, import_pg_core.decimal)("fat_per_100g", { precision: 5, scale: 2 }).notNull(),
  locale: (0, import_pg_core.varchar)("locale", { length: 10 }).notNull().default("en")
});
var water_logs = (0, import_pg_core.pgTable)("water_logs", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  client_id: (0, import_pg_core.integer)("client_id").references(() => clients.id).notNull(),
  date: (0, import_pg_core.timestamp)("date").notNull(),
  value_liters: (0, import_pg_core.decimal)("value_liters", { precision: 4, scale: 2 }).notNull()
});
var weight_logs = (0, import_pg_core.pgTable)("weight_logs", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  client_id: (0, import_pg_core.integer)("client_id").references(() => clients.id).notNull(),
  date: (0, import_pg_core.timestamp)("date").notNull(),
  weight_kg: (0, import_pg_core.decimal)("weight_kg", { precision: 5, scale: 2 }).notNull()
});

// src/index.ts
var connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/dietkem";
var queryClient = (0, import_postgres.default)(connectionString);
var db = (0, import_postgres_js.drizzle)(queryClient, { schema: schema_exports });
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map