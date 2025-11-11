-- Add approved column to notes and quizzes for content moderation
ALTER TABLE public.notes ADD COLUMN approved boolean NOT NULL DEFAULT true;
ALTER TABLE public.quizzes ADD COLUMN approved boolean NOT NULL DEFAULT true;
ALTER TABLE public.study_resources ADD COLUMN approved boolean NOT NULL DEFAULT true;

-- Create index for better query performance
CREATE INDEX idx_notes_approved ON public.notes(approved);
CREATE INDEX idx_quizzes_approved ON public.quizzes(approved);
CREATE INDEX idx_resources_approved ON public.study_resources(approved);

-- Update RLS policies for notes - non-admins only see approved content
DROP POLICY IF EXISTS "Anyone can view notes" ON public.notes;
CREATE POLICY "Users can view approved notes or admins can view all" 
ON public.notes 
FOR SELECT 
USING (approved = true OR has_role(auth.uid(), 'admin'));

-- Update RLS policies for quizzes - non-admins only see approved content
DROP POLICY IF EXISTS "Anyone can view quizzes" ON public.quizzes;
CREATE POLICY "Users can view approved quizzes or admins can view all" 
ON public.quizzes 
FOR SELECT 
USING (approved = true OR has_role(auth.uid(), 'admin'));

-- Update RLS policies for study_resources - non-admins only see approved content
DROP POLICY IF EXISTS "Anyone can view study resources" ON public.study_resources;
CREATE POLICY "Users can view approved resources or admins can view all" 
ON public.study_resources 
FOR SELECT 
USING (approved = true OR has_role(auth.uid(), 'admin'));

-- Create a subjects table for better organization
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on subjects
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS policies for subjects
CREATE POLICY "Anyone can view subjects" 
ON public.subjects 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage subjects" 
ON public.subjects 
FOR ALL 
USING (has_role(auth.uid(), 'admin'));

-- Insert default subjects
INSERT INTO public.subjects (name, description) VALUES
  ('Mathematics', 'Math-related topics'),
  ('Science', 'Scientific topics and concepts'),
  ('Programming', 'Coding and software development'),
  ('Web Technology', 'Web development and internet technologies'),
  ('History', 'Historical events and periods'),
  ('English', 'Language and literature'),
  ('Physics', 'Physical sciences'),
  ('Chemistry', 'Chemical sciences'),
  ('Biology', 'Life sciences')
ON CONFLICT (name) DO NOTHING;