
-- Allow all authenticated users to view the full leaderboard
DROP POLICY IF EXISTS "Users can view their own leaderboard entry" ON public.leaderboard;
CREATE POLICY "Everyone can view leaderboard"
ON public.leaderboard FOR SELECT TO authenticated
USING (true);

-- Function to add points and recalculate all ranks
CREATE OR REPLACE FUNCTION public.add_leaderboard_points(_user_id uuid, _points integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.leaderboard (user_id, score, rank)
  VALUES (_user_id, _points, 0)
  ON CONFLICT (user_id) DO UPDATE
  SET score = leaderboard.score + _points,
      updated_at = now();

  -- Recalculate all ranks
  WITH ranked AS (
    SELECT leaderboard_id, ROW_NUMBER() OVER (ORDER BY score DESC, updated_at ASC) AS new_rank
    FROM public.leaderboard
    WHERE deleted_at IS NULL
  )
  UPDATE public.leaderboard l
  SET rank = r.new_rank
  FROM ranked r
  WHERE l.leaderboard_id = r.leaderboard_id;
END;
$$;

-- Add unique constraint on user_id for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leaderboard_user_id_key'
  ) THEN
    ALTER TABLE public.leaderboard ADD CONSTRAINT leaderboard_user_id_key UNIQUE (user_id);
  END IF;
END $$;
