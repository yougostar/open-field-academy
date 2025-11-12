-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quiz_attempts table for tracking quiz completions
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lesson_completions table
CREATE TABLE IF NOT EXISTS public.lesson_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create user_stats table for tracking overall progress
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  achievements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons"
ON public.lessons FOR SELECT
USING (true);

CREATE POLICY "Admins and instructors can manage lessons"
ON public.lessons FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'instructor'::app_role)
);

-- RLS Policies for quiz_attempts
CREATE POLICY "Users can view their own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can create their own quiz attempts"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quiz attempts"
ON public.quiz_attempts FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for lesson_completions
CREATE POLICY "Users can view their own lesson completions"
ON public.lesson_completions FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can mark lessons as complete"
ON public.lesson_completions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all completions"
ON public.lesson_completions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_stats
CREATE POLICY "Users can view their own stats"
ON public.user_stats FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own stats"
ON public.user_stats FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats"
ON public.user_stats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all stats"
ON public.user_stats FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to update user stats on quiz completion
CREATE OR REPLACE FUNCTION public.update_stats_on_quiz()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert or update user stats
  INSERT INTO public.user_stats (user_id, total_points, current_streak, last_activity_date)
  VALUES (
    NEW.user_id,
    NEW.score,
    1,
    CURRENT_DATE
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_stats.total_points + NEW.score,
    current_streak = CASE
      WHEN user_stats.last_activity_date = CURRENT_DATE THEN user_stats.current_streak
      WHEN user_stats.last_activity_date = CURRENT_DATE - 1 THEN user_stats.current_streak + 1
      ELSE 1
    END,
    last_activity_date = CURRENT_DATE,
    updated_at = now();
    
  RETURN NEW;
END;
$$;

-- Trigger to update stats when quiz is completed
CREATE TRIGGER on_quiz_attempt_created
  AFTER INSERT ON public.quiz_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stats_on_quiz();

-- Function to update enrollment progress
CREATE OR REPLACE FUNCTION public.update_enrollment_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id UUID;
  v_total_lessons INTEGER;
  v_completed_lessons INTEGER;
  v_progress FLOAT;
BEGIN
  -- Get course_id from lesson
  SELECT course_id INTO v_course_id
  FROM public.lessons
  WHERE id = NEW.lesson_id;
  
  -- Count total lessons in course
  SELECT COUNT(*) INTO v_total_lessons
  FROM public.lessons
  WHERE course_id = v_course_id;
  
  -- Count completed lessons by this user
  SELECT COUNT(*) INTO v_completed_lessons
  FROM public.lesson_completions lc
  JOIN public.lessons l ON lc.lesson_id = l.id
  WHERE lc.user_id = NEW.user_id AND l.course_id = v_course_id;
  
  -- Calculate progress percentage
  IF v_total_lessons > 0 THEN
    v_progress := (v_completed_lessons::FLOAT / v_total_lessons::FLOAT) * 100;
  ELSE
    v_progress := 0;
  END IF;
  
  -- Update enrollment
  UPDATE public.enrollments
  SET 
    progress = v_progress,
    completion_status = CASE
      WHEN v_progress >= 100 THEN 'completed'
      WHEN v_progress > 0 THEN 'in progress'
      ELSE 'not started'
    END
  WHERE user_id = NEW.user_id AND course_id = v_course_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update enrollment progress when lesson is completed
CREATE TRIGGER on_lesson_completed
  AFTER INSERT ON public.lesson_completions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_enrollment_progress();