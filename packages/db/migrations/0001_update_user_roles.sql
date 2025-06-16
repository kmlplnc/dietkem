-- First, create a temporary column to store the role values
ALTER TABLE users ADD COLUMN role_temp VARCHAR(255);

-- Copy existing role values to the temporary column
UPDATE users SET role_temp = role::text;

-- Drop the column constraint first
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(255) USING role::text;

-- Now we can safely drop the enum type
DROP TYPE user_role;

-- Create the new enum type with additional roles
CREATE TYPE user_role AS ENUM ('dietitian', 'client', 'admin', 'superadmin');

-- Update the role column to use the new enum type
ALTER TABLE users 
  ALTER COLUMN role TYPE user_role 
  USING role_temp::user_role;

-- Drop the temporary column
ALTER TABLE users DROP COLUMN role_temp;

-- Add a comment to the role column
COMMENT ON COLUMN users.role IS 'User role: dietitian, client, admin, or superadmin';

-- Update existing users to have appropriate roles
-- Note: You may want to manually set specific users as admin/superadmin
UPDATE users SET role = 'dietitian' WHERE role = 'dietitian';
UPDATE users SET role = 'client' WHERE role = 'client'; 