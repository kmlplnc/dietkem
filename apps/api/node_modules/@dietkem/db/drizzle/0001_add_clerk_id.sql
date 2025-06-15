-- Add clerk_id column
ALTER TABLE users ADD COLUMN clerk_id VARCHAR(255) UNIQUE NOT NULL;

-- Remove password_hash column
ALTER TABLE users DROP COLUMN password_hash; 