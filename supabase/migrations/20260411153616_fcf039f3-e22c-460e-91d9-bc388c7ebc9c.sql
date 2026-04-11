
-- Create challenge_participants table
CREATE TABLE public.challenge_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.default_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'failed')),
  progress INTEGER NOT NULL DEFAULT 0,
  target_days INTEGER NOT NULL DEFAULT 7,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_update_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own participations"
ON public.challenge_participants FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can join challenges"
ON public.challenge_participants FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
ON public.challenge_participants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE TRIGGER update_challenge_participants_updated_at
BEFORE UPDATE ON public.challenge_participants
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();
