-- Add new columns to users table for enhanced preferences
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS daily_goal INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS weekly_goal INTEGER DEFAULT 35,
ADD COLUMN IF NOT EXISTS preferred_work_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00"}',
ADD COLUMN IF NOT EXISTS break_reminders BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS weekend_mode BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS focus_mode BOOLEAN DEFAULT FALSE;

-- Add task templates table
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'personal',
    estimated_duration INTEGER, -- in minutes
    tags JSONB DEFAULT '[]',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern JSONB, -- for recurring tasks
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add task tags table for better organization
CREATE TABLE IF NOT EXISTS task_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1', -- hex color
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Add task_tag_relations table for many-to-many relationship
CREATE TABLE IF NOT EXISTS task_tag_relations (
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES task_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
);

-- Add productivity metrics table
CREATE TABLE IF NOT EXISTS productivity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tasks_completed INTEGER DEFAULT 0,
    tasks_created INTEGER DEFAULT 0,
    pomodoro_sessions INTEGER DEFAULT 0,
    focus_time INTEGER DEFAULT 0, -- in minutes
    break_time INTEGER DEFAULT 0, -- in minutes
    productivity_score DECIMAL(5,2), -- calculated score 0-100
    mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Add habit tracking table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) DEFAULT 'personal',
    target_frequency INTEGER DEFAULT 1, -- times per day
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add habit completions table
CREATE TABLE IF NOT EXISTS habit_completions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_task_templates_user_id ON task_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_user_id ON task_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_task_tag_relations_task_id ON task_tag_relations(task_id);
CREATE INDEX IF NOT EXISTS idx_task_tag_relations_tag_id ON task_tag_relations(tag_id);
CREATE INDEX IF NOT EXISTS idx_productivity_metrics_user_id ON productivity_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_productivity_metrics_date ON productivity_metrics(date);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);

-- Add RLS policies for new tables
ALTER TABLE task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Task templates policies
CREATE POLICY "Users can manage own task templates" ON task_templates
    FOR ALL USING (auth.uid() = user_id);

-- Task tags policies
CREATE POLICY "Users can manage own task tags" ON task_tags
    FOR ALL USING (auth.uid() = user_id);

-- Task tag relations policies
CREATE POLICY "Users can manage own task tag relations" ON task_tag_relations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tasks 
            WHERE tasks.id = task_tag_relations.task_id 
            AND tasks.user_id = auth.uid()
        )
    );

-- Productivity metrics policies
CREATE POLICY "Users can manage own productivity metrics" ON productivity_metrics
    FOR ALL USING (auth.uid() = user_id);

-- Habits policies
CREATE POLICY "Users can manage own habits" ON habits
    FOR ALL USING (auth.uid() = user_id);

-- Habit completions policies
CREATE POLICY "Users can manage own habit completions" ON habit_completions
    FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_task_templates_updated_at BEFORE UPDATE ON task_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default task tags for new users
INSERT INTO task_tags (user_id, name, color) 
SELECT id, 'Urgente', '#ef4444' FROM users WHERE NOT EXISTS (
    SELECT 1 FROM task_tags WHERE user_id = users.id AND name = 'Urgente'
);

INSERT INTO task_tags (user_id, name, color) 
SELECT id, 'Importante', '#f59e0b' FROM users WHERE NOT EXISTS (
    SELECT 1 FROM task_tags WHERE user_id = users.id AND name = 'Importante'
);

INSERT INTO task_tags (user_id, name, color) 
SELECT id, 'Rápido', '#10b981' FROM users WHERE NOT EXISTS (
    SELECT 1 FROM task_tags WHERE user_id = users.id AND name = 'Rápido'
);

-- Create function to calculate productivity score
CREATE OR REPLACE FUNCTION calculate_productivity_score(
    p_tasks_completed INTEGER,
    p_tasks_created INTEGER,
    p_pomodoro_sessions INTEGER,
    p_focus_time INTEGER
) RETURNS DECIMAL(5,2) AS $$
DECLARE
    completion_rate DECIMAL(5,2);
    pomodoro_bonus DECIMAL(5,2);
    focus_bonus DECIMAL(5,2);
    total_score DECIMAL(5,2);
BEGIN
    -- Calculate completion rate (0-60 points)
    IF p_tasks_created > 0 THEN
        completion_rate := (p_tasks_completed::DECIMAL / p_tasks_created) * 60;
    ELSE
        completion_rate := CASE WHEN p_tasks_completed > 0 THEN 60 ELSE 0 END;
    END IF;
    
    -- Pomodoro bonus (0-25 points)
    pomodoro_bonus := LEAST(p_pomodoro_sessions * 5, 25);
    
    -- Focus time bonus (0-15 points)
    focus_bonus := LEAST(p_focus_time / 10.0, 15);
    
    total_score := completion_rate + pomodoro_bonus + focus_bonus;
    
    RETURN LEAST(total_score, 100.00);
END;
$$ LANGUAGE plpgsql;
