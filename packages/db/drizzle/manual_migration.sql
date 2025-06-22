-- Final fix for clients table structure
-- Based on current table structure analysis

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'user_id') THEN
        ALTER TABLE clients ADD COLUMN user_id integer;
        RAISE NOTICE 'user_id column added';
    END IF;
END $$;

-- Add foreign key constraint for user_id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'clients' 
        AND constraint_name = 'clients_user_id_users_id_fk'
    ) THEN
        ALTER TABLE clients ADD CONSTRAINT clients_user_id_users_id_fk 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
        RAISE NOTICE 'user_id foreign key constraint added';
    END IF;
END $$;

-- Remove weight_kg column (it should not exist in the schema)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'weight_kg') THEN
        ALTER TABLE clients DROP COLUMN weight_kg;
        RAISE NOTICE 'weight_kg column removed';
    END IF;
END $$;

-- Fix height_cm column to have proper precision and scale
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'height_cm' AND data_type = 'numeric' AND numeric_precision IS NULL) THEN
        ALTER TABLE clients ALTER COLUMN height_cm TYPE numeric(5,2);
        RAISE NOTICE 'height_cm column precision fixed to numeric(5,2)';
    END IF;
END $$;

-- Fix status column length if it's not 10 characters
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'clients' AND column_name = 'status' AND character_maximum_length != 10) THEN
        ALTER TABLE clients ALTER COLUMN status TYPE varchar(10);
        RAISE NOTICE 'status column length fixed to varchar(10)';
    END IF;
END $$;

-- Verify the final table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length,
    numeric_precision,
    numeric_scale
FROM information_schema.columns 
WHERE table_name = 'clients' 
ORDER BY ordinal_position;

-- Add room_url column to consultations table
ALTER TABLE consultations ADD COLUMN room_url VARCHAR(255); 