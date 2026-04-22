-- Enable RLS on all three tables
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_likes  ENABLE ROW LEVEL SECURITY;

-- ── photo_sessions ───────────────────────────────────────────────────────────

CREATE POLICY "photo_sessions_select_public"
  ON public.photo_sessions FOR SELECT
  USING (true);

CREATE POLICY "photo_sessions_insert_owner"
  ON public.photo_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photo_sessions_update_owner"
  ON public.photo_sessions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "photo_sessions_delete_owner"
  ON public.photo_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- ── session_photos ───────────────────────────────────────────────────────────

CREATE POLICY "session_photos_select_public"
  ON public.session_photos FOR SELECT
  USING (true);

-- Only the session owner may insert photos into their session
CREATE POLICY "session_photos_insert_owner"
  ON public.session_photos FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.photo_sessions ps
      WHERE ps.id = session_id AND ps.user_id = auth.uid()
    )
  );

CREATE POLICY "session_photos_delete_owner"
  ON public.session_photos FOR DELETE
  USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.photo_sessions ps
      WHERE ps.id = session_id AND ps.user_id = auth.uid()
    )
  );

-- ── session_likes ────────────────────────────────────────────────────────────

CREATE POLICY "session_likes_select_public"
  ON public.session_likes FOR SELECT
  USING (true);

CREATE POLICY "session_likes_insert_authenticated"
  ON public.session_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_likes_delete_own"
  ON public.session_likes FOR DELETE
  USING (auth.uid() = user_id);
