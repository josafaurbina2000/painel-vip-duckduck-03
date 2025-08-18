-- Remove the overly permissive public access policy
DROP POLICY IF EXISTS "Allow public access to VIPs" ON public.vips;

-- Enable RLS (should already be enabled, but making sure)
ALTER TABLE public.vips ENABLE ROW LEVEL SECURITY;

-- Create secure policies that require authentication
-- Users can only access their own VIP records
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