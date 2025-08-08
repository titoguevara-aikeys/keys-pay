-- Step 1: Add super_admin to enum in separate transaction
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'app_role' AND e.enumlabel = 'super_admin') THEN
            ALTER TYPE public.app_role ADD VALUE 'super_admin';
        END IF;
    ELSE
        CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user', 'super_admin');
    END IF;
END $$;