-- Test data for email verification codes (optional, for development only)
-- INSERT INTO "email_verification_codes" ("email", "code", "expires_at", "used") VALUES
--   ('test@example.com', '123456', NOW() + INTERVAL '5 minutes', 'false'),
--   ('demo@example.com', '654321', NOW() + INTERVAL '5 minutes', 'false');

-- Query examples for testing:

-- 1. Check if user exists
-- SELECT * FROM "users" WHERE "email" = 'test@example.com';

-- 2. Find valid verification code for an email
-- SELECT * FROM "email_verification_codes" 
-- WHERE "email" = 'test@example.com' 
--   AND "code" = '123456' 
--   AND "used" = 'false' 
--   AND "expires_at" > NOW()
-- ORDER BY "created_at" DESC 
-- LIMIT 1;

-- 3. Count recent verification attempts (rate limiting)
-- SELECT COUNT(*) FROM "email_verification_codes" 
-- WHERE "email" = 'test@example.com' 
--   AND "created_at" > NOW() - INTERVAL '1 hour';

-- 4. Mark code as used
-- UPDATE "email_verification_codes" 
-- SET "used" = 'true' 
-- WHERE "id" = 1;

-- 5. Clean up expired codes
-- DELETE FROM "email_verification_codes" 
-- WHERE "expires_at" < NOW() OR "used" = 'true'; 