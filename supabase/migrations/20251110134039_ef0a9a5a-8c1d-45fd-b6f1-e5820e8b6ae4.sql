-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('student', 'instructor', 'admin');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create enrollments table
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completion_status TEXT DEFAULT 'in progress',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

-- Enable RLS on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create notes table
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create study_resources table
CREATE TABLE public.study_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('article', 'video', 'pdf')),
  link TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on study_resources
ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for courses
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  USING (true);

CREATE POLICY "Instructors and admins can create courses"
  ON public.courses FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Instructors can update their own courses"
  ON public.courses FOR UPDATE
  USING (
    instructor_id = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete courses"
  ON public.courses FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for enrollments
CREATE POLICY "Users can view their own enrollments"
  ON public.enrollments FOR SELECT
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Students can enroll themselves"
  ON public.enrollments FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own enrollments"
  ON public.enrollments FOR UPDATE
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notes
CREATE POLICY "Anyone can view notes"
  ON public.notes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own notes or admins can update all"
  ON public.notes FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete notes"
  ON public.notes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for quizzes
CREATE POLICY "Anyone can view quizzes"
  ON public.quizzes FOR SELECT
  USING (true);

CREATE POLICY "Instructors and admins can create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'instructor') OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Creators and admins can update quizzes"
  ON public.quizzes FOR UPDATE
  USING (
    created_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete quizzes"
  ON public.quizzes FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for study_resources
CREATE POLICY "Anyone can view study resources"
  ON public.study_resources FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create study resources"
  ON public.study_resources FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own resources or admins can update all"
  ON public.study_resources FOR UPDATE
  USING (
    uploaded_by = auth.uid() OR 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete study resources"
  ON public.study_resources FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email
  );
  
  -- Assign default student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and role on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();