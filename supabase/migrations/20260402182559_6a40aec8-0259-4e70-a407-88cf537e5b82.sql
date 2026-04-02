
CREATE TABLE public.learning_wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.learning_wishes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view wishes"
ON public.learning_wishes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can post wishes"
ON public.learning_wishes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors and admins can delete wishes"
ON public.learning_wishes FOR DELETE
TO authenticated
USING ((user_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));

ALTER PUBLICATION supabase_realtime ADD TABLE public.learning_wishes;
