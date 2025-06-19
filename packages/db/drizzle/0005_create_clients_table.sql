CREATE TABLE IF NOT EXISTS "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"gender" varchar(10),
	"birth_date" date,
	"height_cm" integer,
	"weight_kg" integer,
	"email" varchar(255),
	"phone" varchar(20),
	"notes" text,
	"diseases" text,
	"allergies" text,
	"medications" text,
	"created_at" timestamp DEFAULT now()
); 