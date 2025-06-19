-- Fix clients table structure to match the schema
-- This will add missing columns and fix data types

-- Add status column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'status') THEN
        ALTER TABLE clients ADD COLUMN status varchar(10) DEFAULT 'active' NOT NULL;
    END IF;
END $$;

-- Add activity_level column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'activity_level') THEN
        ALTER TABLE clients ADD COLUMN activity_level varchar(32);
    END IF;
END $$;

-- Add has_active_plan column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'has_active_plan') THEN
        ALTER TABLE clients ADD COLUMN has_active_plan boolean DEFAULT false;
    END IF;
END $$;

-- Fix name column to be NOT NULL if it isn't already
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'name' AND is_nullable = 'YES') THEN
        -- First, update any NULL names to a default value
        UPDATE clients SET name = 'Unknown Client' WHERE name IS NULL;
        -- Then make the column NOT NULL
        ALTER TABLE clients ALTER COLUMN name SET NOT NULL;
    END IF;
END $$;

-- Fix gender column length if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'gender' AND character_maximum_length = 10) THEN
        ALTER TABLE clients ALTER COLUMN gender TYPE varchar(50);
    END IF;
END $$;

-- Fix birth_date column type from date to timestamp if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'birth_date' AND data_type = 'date') THEN
        ALTER TABLE clients ALTER COLUMN birth_date TYPE timestamp;
    END IF;
END $$;

-- Fix height_cm column type from integer to decimal if needed
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'height_cm' AND data_type = 'integer') THEN
        ALTER TABLE clients ALTER COLUMN height_cm TYPE numeric(5,2);
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'created_at') THEN
        ALTER TABLE clients ADD COLUMN created_at timestamp DEFAULT now() NOT NULL;
    END IF;
END $$;

-- Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position; 