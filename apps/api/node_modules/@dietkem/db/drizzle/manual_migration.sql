-- First, backup the existing data
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;

-- Drop the existing enum type if it exists
DROP TYPE IF EXISTS user_role CASCADE;

-- Create the enum type with the correct values
CREATE TYPE user_role AS ENUM ('dietitian', 'client');

-- Recreate the users table with the correct structure
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restore the data from backup
INSERT INTO users (clerk_id, email, role, created_at)
SELECT 
    clerk_id,
    email,
    'client'::user_role as role,
    created_at
FROM users_backup;

-- Drop the backup table
DROP TABLE IF EXISTS users_backup;

-- Add a comment to the role column
COMMENT ON COLUMN users.role IS 'User role: dietitian or client';

-- Update existing users to have appropriate roles
-- Note: You may want to manually set specific users as admin/superadmin
UPDATE users SET role = 'dietitian' WHERE role = 'dietitian';
UPDATE users SET role = 'client' WHERE role = 'client';

-- Add clerk_id column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS clerk_id VARCHAR(255) UNIQUE;

-- Remove password_hash column from users table
ALTER TABLE users DROP COLUMN IF EXISTS password_hash;

-- Drop and recreate the users table with updated_at column
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP DEFAULT now() NOT NULL
); 