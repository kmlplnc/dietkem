ALTER TABLE "measurements" RENAME COLUMN "date" TO "measured_at";
ALTER TABLE "measurements" ALTER COLUMN "measured_at" TYPE text; 