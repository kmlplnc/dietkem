-- First, backup the existing data
CREATE TABLE IF NOT EXISTS users_backup AS SELECT * FROM users;

-- Drop the existing enum type if it exists
DROP TYPE IF EXISTS user_role CASCADE;

-- Create the new enum type with updated values
CREATE TYPE user_role AS ENUM (
  'subscriber_basic',
  'subscriber_pro',
  'clinic_admin',
  'dietitian_team_member',
  'admin',
  'superadmin'
);

-- Recreate the users table with the updated structure
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'subscriber_basic',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Restore the data from backup with role mapping
INSERT INTO users (clerk_id, email, role, created_at, updated_at)
SELECT 
  clerk_id,
  email,
  CASE 
    WHEN role = 'dietitian' THEN 'dietitian_team_member'::user_role
    WHEN role = 'client' THEN 'subscriber_basic'::user_role
    WHEN role = 'admin' THEN 'admin'::user_role
    WHEN role = 'superadmin' THEN 'superadmin'::user_role
    ELSE 'subscriber_basic'::user_role
  END as role,
  created_at,
  updated_at
FROM users_backup;

-- Drop the backup table
DROP TABLE IF EXISTS users_backup;

-- Add a comment to the role column
COMMENT ON COLUMN users.role IS 'User role: subscriber_basic, subscriber_pro, clinic_admin, dietitian_team_member, admin, or superadmin'; 