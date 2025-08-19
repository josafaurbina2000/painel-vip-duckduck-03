-- Remove existing RLS policies
DROP POLICY IF EXISTS "Users can view their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can create their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can update their own VIPs" ON public.vips;
DROP POLICY IF EXISTS "Users can delete their own VIPs" ON public.vips;

-- Create public access policies for VIPs table
CREATE POLICY "Anyone can view VIPs" 
ON public.vips 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create VIPs" 
ON public.vips 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update VIPs" 
ON public.vips 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete VIPs" 
ON public.vips 
FOR DELETE 
USING (true);