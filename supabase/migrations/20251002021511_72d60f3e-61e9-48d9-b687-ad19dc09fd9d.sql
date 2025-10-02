-- Create table for saving goals history
CREATE TABLE public.saving_goals_history (
  history_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.saving_goals(goal_id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount_added NUMERIC NOT NULL,
  previous_amount NUMERIC NOT NULL,
  new_amount NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saving_goals_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for saving_goals_history
CREATE POLICY "Users can view their own saving goals history"
ON public.saving_goals_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saving goals history"
ON public.saving_goals_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_saving_goals_history_goal_id ON public.saving_goals_history(goal_id);
CREATE INDEX idx_saving_goals_history_user_id ON public.saving_goals_history(user_id);