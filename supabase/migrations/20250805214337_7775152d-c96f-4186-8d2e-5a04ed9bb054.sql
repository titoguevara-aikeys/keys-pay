-- Add policy to allow viewing profiles for family relationship queries
CREATE POLICY "Allow family relationship profile queries" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.family_controls 
    WHERE family_controls.child_id = profiles.user_id 
    AND family_controls.parent_id = auth.uid()
  )
  OR 
  profiles.user_id = auth.uid()
);