
-- Create note_bookmarks table
CREATE TABLE public.note_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, note_id)
);

ALTER TABLE public.note_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
ON public.note_bookmarks FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
ON public.note_bookmarks FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
ON public.note_bookmarks FOR DELETE TO authenticated
USING (auth.uid() = user_id);
