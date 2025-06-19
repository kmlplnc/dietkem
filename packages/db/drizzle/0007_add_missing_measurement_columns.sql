ALTER TABLE "measurements" ADD COLUMN "hip_cm" numeric(5, 2);
ALTER TABLE "measurements" ADD COLUMN "neck_cm" numeric(5, 2);
ALTER TABLE "measurements" ADD COLUMN "chest_cm" numeric(5, 2);
ALTER TABLE "measurements" ADD COLUMN "arm_cm" numeric(5, 2);
ALTER TABLE "measurements" ADD COLUMN "thigh_cm" numeric(5, 2);
ALTER TABLE "measurements" ADD COLUMN "note" text;
ALTER TABLE "measurements" ADD COLUMN "created_at" timestamp DEFAULT now(); 