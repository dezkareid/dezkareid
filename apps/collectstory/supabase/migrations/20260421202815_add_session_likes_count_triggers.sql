-- Increment likes_count on photo_sessions when a like is inserted
CREATE OR REPLACE FUNCTION public.increment_session_likes_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.photo_sessions
  SET likes_count = likes_count + 1
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$;

-- Decrement likes_count on photo_sessions when a like is deleted
CREATE OR REPLACE FUNCTION public.decrement_session_likes_count()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.photo_sessions
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = OLD.session_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_increment_session_likes_count ON public.session_likes;
CREATE TRIGGER trg_increment_session_likes_count
  AFTER INSERT ON public.session_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_session_likes_count();

DROP TRIGGER IF EXISTS trg_decrement_session_likes_count ON public.session_likes;
CREATE TRIGGER trg_decrement_session_likes_count
  AFTER DELETE ON public.session_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.decrement_session_likes_count();
