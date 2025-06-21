CREATE TABLE IF NOT EXISTS "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"consultation_date" timestamp NOT NULL,
	"consultation_time" varchar(10) NOT NULL,
	"consultation_type" varchar(50) NOT NULL,
	"notes" text,
	"status" varchar(20) DEFAULT 'scheduled' NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" DROP CONSTRAINT "clients_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "diseases" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "allergies" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "medications" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "activity_level" varchar(32);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "measured_at" text;--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "hip_cm" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "neck_cm" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "chest_cm" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "arm_cm" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "thigh_cm" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "measurements" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "user_id";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "weight_kg";--> statement-breakpoint
ALTER TABLE "clients" DROP COLUMN IF EXISTS "goal";--> statement-breakpoint
ALTER TABLE "measurements" DROP COLUMN IF EXISTS "date";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "consultations" ADD CONSTRAINT "consultations_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "consultations" ADD CONSTRAINT "consultations_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
