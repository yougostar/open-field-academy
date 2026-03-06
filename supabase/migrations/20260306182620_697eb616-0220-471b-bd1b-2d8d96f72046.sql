
-- Create live_sessions table for teachers to schedule/start live classes
CREATE TABLE public.live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subject text NOT NULL,
  description text DEFAULT '',
  room_id text NOT NULL UNIQUE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT false,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view sessions
CREATE POLICY "Authenticated users can view live sessions"
  ON public.live_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Instructors and admins can create sessions
CREATE POLICY "Instructors and admins can create live sessions"
  ON public.live_sessions FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'instructor') OR has_role(auth.uid(), 'admin'));

-- Creators and admins can update sessions
CREATE POLICY "Creators and admins can update live sessions"
  ON public.live_sessions FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Admins can delete sessions
CREATE POLICY "Admins can delete live sessions"
  ON public.live_sessions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));
