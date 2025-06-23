import { pgTable, serial, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

// Blog yazıları tablosu
export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  image: text('image'),
  status: text('status').default('pending'), // 'pending', 'approved', 'rejected', 'published'
  created_by: integer('created_by').references(() => users.id),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
  published_at: timestamp('published_at'),
  view_count: integer('view_count').default(0),
  is_featured: boolean('is_featured').default(false),
  meta_title: text('meta_title'),
  meta_description: text('meta_description'),
  slug: text('slug').unique(),
});

// Blog kategorileri tablosu
export const blog_categories = pgTable('blog_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Blog etiketleri tablosu
export const blog_tags = pgTable('blog_tags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

// Blog-etiket ilişki tablosu (many-to-many)
export const blog_tag_relations = pgTable('blog_tag_relations', {
  id: serial('id').primaryKey(),
  blog_id: integer('blog_id').references(() => blogs.id).notNull(),
  tag_id: integer('tag_id').references(() => blog_tags.id).notNull(),
});

// Blog görüntülenme istatistikleri
export const blog_views = pgTable('blog_views', {
  id: serial('id').primaryKey(),
  blog_id: integer('blog_id').references(() => blogs.id).notNull(),
  user_id: integer('user_id').references(() => users.id),
  ip_address: text('ip_address'),
  user_agent: text('user_agent'),
  viewed_at: timestamp('viewed_at').defaultNow(),
});

// TypeScript tipleri
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type BlogCategory = typeof blog_categories.$inferSelect;
export type NewBlogCategory = typeof blog_categories.$inferInsert;
export type BlogTag = typeof blog_tags.$inferSelect;
export type NewBlogTag = typeof blog_tags.$inferInsert;
export type BlogView = typeof blog_views.$inferSelect;
export type NewBlogView = typeof blog_views.$inferInsert; 