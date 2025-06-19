import { pgTable, serial, integer, real, text, timestamp } from 'drizzle-orm/pg-core';
import { clients } from './clients';

export const measurements = pgTable('measurements', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  weight_kg: real('weight_kg').notNull(),
  waist_cm: real('waist_cm'),
  hip_cm: real('hip_cm'),
  neck_cm: real('neck_cm'),
  chest_cm: real('chest_cm'),
  arm_cm: real('arm_cm'),
  thigh_cm: real('thigh_cm'),
  body_fat_percent: real('body_fat_percent'),
  measured_at: text('measured_at'),
  note: text('note'),
  created_at: timestamp('created_at').defaultNow(),
});

export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert; 