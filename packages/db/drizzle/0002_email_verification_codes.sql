-- Email verification codes table
CREATE TABLE IF NOT EXISTS "email_verification_codes" (
  "id" SERIAL PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL,
  "code" VARCHAR(6) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "used" TEXT DEFAULT 'false',
  "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS "email_verification_codes_email_idx" ON "email_verification_codes" ("email");
CREATE INDEX IF NOT EXISTS "email_verification_codes_code_idx" ON "email_verification_codes" ("code");
CREATE INDEX IF NOT EXISTS "email_verification_codes_expires_at_idx" ON "email_verification_codes" ("expires_at");
CREATE INDEX IF NOT EXISTS "email_verification_codes_used_idx" ON "email_verification_codes" ("used"); 