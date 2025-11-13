-- Add class and file_url columns to notes table
ALTER TABLE public.notes
ADD COLUMN class text NOT NULL DEFAULT 'Class 10',
ADD COLUMN file_url text;

-- Create storage bucket for notes PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('notes', 'notes', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for notes bucket
CREATE POLICY "Anyone can view notes files"
ON storage.objects FOR SELECT
USING (bucket_id = 'notes');

CREATE POLICY "Admins can upload notes files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notes files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notes files"
ON storage.objects FOR DELETE
USING (bucket_id = 'notes' AND has_role(auth.uid(), 'admin'::app_role));