import { pgTable, serial, integer, timestamp, varchar, text } from 'drizzle-orm/pg-core';
import { clients } from './clients';
import { users } from './users';

export const consultations = pgTable('consultations', {
  id: serial('id').primaryKey(),
  client_id: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  consultation_date: timestamp('consultation_date').notNull(),
  consultation_time: varchar('consultation_time', { length: 10 }).notNull(), // HH:MM format
  consultation_type: varchar('consultation_type', { length: 50 }).notNull(), // initial, follow-up, emergency, online
  notes: text('notes'),
  status: varchar('status', { length: 20 }).default('scheduled').notNull(), // scheduled, completed, cancelled
  created_by: integer('created_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  room_url: varchar('room_url', { length: 255 }), // Daily.co oda URL'si (opsiyonel)
}); 