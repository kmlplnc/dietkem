-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255) UNIQUE;

-- Remove password_hash column from users table
ALTER TABLE users DROP COLUMN IF EXISTS password_hash; 