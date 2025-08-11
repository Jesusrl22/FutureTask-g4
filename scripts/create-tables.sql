-- Create the 'users' table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    name text,
    country text,
    timezone text,
    joined_at timestamptz DEFAULT now(),
    last_active timestamptz DEFAULT now(),
    is_premium boolean DEFAULT FALSE,
    subscription_type text DEFAULT 'free'
);

-- Enable Row Level Security (RLS) for 'users' table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy for users to view and update their own profile
CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy for new users to insert their profile after signup
CREATE POLICY "New users can insert their own profile." ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create the 'tasks' table
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    text text NOT NULL,
    completed boolean DEFAULT FALSE,
    date date NOT NULL,
    priority text DEFAULT 'medium', -- 'low', 'medium', 'high'
    category text DEFAULT 'personal',
    notes text,
    completed_at timestamptz,
    reminder_time time with time zone,
    notified boolean DEFAULT FALSE,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS) for 'tasks' table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own tasks
CREATE POLICY "Users can view their own tasks." ON public.tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own tasks
CREATE POLICY "Users can insert their own tasks." ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own tasks
CREATE POLICY "Users can update their own tasks." ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own tasks
CREATE POLICY "Users can delete their own tasks." ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create the 'achievements' table
CREATE TABLE IF NOT EXISTS public.achievements (
    id text NOT NULL, -- e.g., 'first-task', 'streak-3'
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    unlocked boolean DEFAULT FALSE,
    unlocked_at timestamptz,
    PRIMARY KEY (id, user_id)
);

-- Enable Row Level Security (RLS) for 'achievements' table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own achievements
CREATE POLICY "Users can view their own achievements." ON public.achievements
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own achievements
CREATE POLICY "Users can insert their own achievements." ON public.achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own achievements
CREATE POLICY "Users can update their own achievements." ON public.achievements
  FOR UPDATE USING (auth.uid() = user_id);

-- Create the 'notifications' table
CREATE TABLE IF NOT EXISTS public.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL, -- 'task', 'achievement', 'reminder', 'streak'
    timestamp timestamptz DEFAULT now(),
    read boolean DEFAULT FALSE,
    task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL -- Optional: link to a task
);

-- Enable Row Level Security (RLS) for 'notifications' table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own notifications
CREATE POLICY "Users can view their own notifications." ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own notifications
CREATE POLICY "Users can insert their own notifications." ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own notifications
CREATE POLICY "Users can update their own notifications." ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own notifications
CREATE POLICY "Users can delete their own notifications." ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);
