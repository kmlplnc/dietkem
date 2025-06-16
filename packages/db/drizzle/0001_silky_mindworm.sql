ALTER TYPE "user_role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TYPE "user_role" ADD VALUE 'superadmin';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "password_hash";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");