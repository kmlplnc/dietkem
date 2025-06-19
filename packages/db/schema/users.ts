import { pgTable, serial, varchar, timestamp, pgEnum, text } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "subscriber_basic",
  "subscriber_pro",
  "clinic_admin",
  "dietitian_team_member",
  "admin",
  "superadmin"
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerk_id: varchar("clerk_id", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  first_name: varchar("first_name", { length: 255 }),
  last_name: varchar("last_name", { length: 255 }),
  username: varchar("username", { length: 255 }),
  role: userRoleEnum("role").notNull().default("subscriber_basic"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
  trial_started_at: timestamp("trial_started_at"),
  trial_used: text("trial_used").default('false'),
  first_subscription_started_at: timestamp("first_subscription_started_at"),
  avatar_url: varchar("avatar_url", { length: 500 }),
});

export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

export const accounts = pgTable("accounts", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: serial("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

export const emailVerificationCodes = pgTable("email_verification_codes", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  used: text("used").default('false'),
  created_at: timestamp("created_at").defaultNow(),
}); 