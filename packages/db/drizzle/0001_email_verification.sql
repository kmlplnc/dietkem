CREATE TABLE IF NOT EXISTS "email_verification_codes" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "code" VARCHAR(6) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "used" TEXT DEFAULT 'false',
  "created_at" TIMESTAMP DEFAULT NOW()
); 