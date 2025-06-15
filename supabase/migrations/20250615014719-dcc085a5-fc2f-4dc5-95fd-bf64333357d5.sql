
-- First, add the user_id column as nullable
ALTER TABLE public.vips ADD COLUMN IF NOT EXISTS user_id UUID;

-- Remove the foreign key constraint temporarily to allow the migration
-- We'll add it back after implementing authentication

-- Remove the insecure "Allow all access" policy if it exists
DROP POLICY IF EXISTS "Allow all access to vips" ON public.vips;

-- Create secure RLS policies that require authentication
CREATE POLICY "Users can view their own VIPs" 
  ON public.vips 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own VIPs" 
  ON public.vips 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own VIPs" 
  ON public.vips 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own VIPs" 
  ON public.vips 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add database constraints for security
DO $$
BEGIN
  -- Check and add constraints only if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_amount_paid_positive') THEN
    ALTER TABLE public.vips ADD CONSTRAINT check_amount_paid_positive CHECK (amount_paid > 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_duration_positive') THEN
    ALTER TABLE public.vips ADD CONSTRAINT check_duration_positive CHECK (duration_days > 0);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_player_name_length') THEN
    ALTER TABLE public.vips ADD CONSTRAINT check_player_name_length CHECK (char_length(player_name) >= 2 AND char_length(player_name) <= 100);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_valid_status') THEN
    ALTER TABLE public.vips ADD CONSTRAINT check_valid_status CHECK (status IN ('active', 'expired'));
  END IF;
END $$;

-- Set player_name as NOT NULL
ALTER TABLE public.vips ALTER COLUMN player_name SET NOT NULL;

-- Add index for better performance on user queries
CREATE INDEX IF NOT EXISTS idx_vips_user_id ON public.vips(user_id);
