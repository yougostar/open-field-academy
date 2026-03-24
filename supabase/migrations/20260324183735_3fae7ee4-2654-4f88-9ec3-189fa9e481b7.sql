
-- Discussion threads table (forum-style)
CREATE TABLE public.discussion_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enrolled users can view threads" ON public.discussion_threads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enrolled users can create threads" ON public.discussion_threads
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors and admins can update threads" ON public.discussion_threads
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors and admins can delete threads" ON public.discussion_threads
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Thread replies table
CREATE TABLE public.thread_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.thread_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view replies" ON public.thread_replies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create replies" ON public.thread_replies
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors and admins can update replies" ON public.thread_replies
  FOR UPDATE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Authors and admins can delete replies" ON public.thread_replies
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Course messages table (real-time chat)
CREATE TABLE public.course_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.course_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view messages" ON public.course_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can send messages" ON public.course_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authors and admins can delete messages" ON public.course_messages
  FOR DELETE TO authenticated USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_messages;
