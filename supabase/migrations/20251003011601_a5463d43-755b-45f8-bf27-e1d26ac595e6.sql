-- Create budgeting_history table
CREATE TABLE public.budgeting_history (
  history_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  budget_id UUID NOT NULL,
  user_id UUID NOT NULL,
  amount_changed NUMERIC NOT NULL,
  previous_spent NUMERIC NOT NULL,
  new_spent NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.budgeting_history ENABLE ROW LEVEL SECURITY;

-- Create policies for budgeting_history
CREATE POLICY "Users can view their own budgeting history"
ON public.budgeting_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgeting history"
ON public.budgeting_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);