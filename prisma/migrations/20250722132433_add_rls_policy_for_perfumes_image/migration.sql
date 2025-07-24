ALTER TABLE public.perfumes_image ENABLE ROW LEVEL SECURITY;

-- Create the policy to allow public read access.
-- The policy is dropped first if it exists to make the migration re-runnable.
DROP POLICY IF EXISTS "Allow public read access on perfumes_image" ON public.perfumes_image;

CREATE POLICY "Allow public read access on perfumes_image"
ON public.perfumes_image
FOR SELECT
TO anon, authenticated
USING (true);

-- Change security context for the main search function
ALTER FUNCTION public.search_perfumes(text, uuid[], uuid[], uuid[], uuid, integer)
SECURITY DEFINER;

-- Change security context for the total count function
ALTER FUNCTION public.search_perfumes_total(text, uuid[], uuid[], uuid[])
SECURITY DEFINER;

-- As a best practice, it's good to set the search_path for SECURITY DEFINER functions
-- to prevent potential hijacking.
ALTER FUNCTION public.search_perfumes(text, uuid[], uuid[], uuid[], uuid, integer)
SET search_path = public;

ALTER FUNCTION public.search_perfumes_total(text, uuid[], uuid[], uuid[])
SET search_path = public;