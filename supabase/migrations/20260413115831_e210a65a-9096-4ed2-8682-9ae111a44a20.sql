
-- 1. Prevent role escalation on profiles table
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.role := OLD.role;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_profiles_role_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();

-- 2. Restrict quiz_options to authenticated users only
DROP POLICY IF EXISTS "Allow read options" ON public.quiz_options;
CREATE POLICY "Authenticated users can read options"
ON public.quiz_options
FOR SELECT
TO authenticated
USING (true);

-- 3. Restrict quizzes to authenticated users only  
DROP POLICY IF EXISTS "Allow read quizzes" ON public.quizzes;
CREATE POLICY "Authenticated users can read quizzes"
ON public.quizzes
FOR SELECT
TO authenticated
USING (true);

-- 4. Restrict profiles to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);
