-- Fix security advisory: "View public.last_arrivals is defined with the SECURITY DEFINER property"
-- The view defaulted to SECURITY INVOKER implicitly; this migration makes it explicit.
-- GRANTs are re-applied because DROP VIEW removes them.

DROP VIEW IF EXISTS public.last_arrivals;

CREATE VIEW public.last_arrivals
WITH (security_invoker = true)
AS
SELECT
  ci.id,
  ci.name,
  ci.image_url,
  ci.slug,
  ci.created_at,
  ci.collection_id,
  p.username,
  p.avatar_url,
  l.name   AS line_name,
  l.slug   AS line_slug,
  b.name   AS brand_name,
  b.slug   AS brand_slug,
  col.slug AS collection_slug
FROM public.collection_items ci
JOIN public.profiles p      ON p.id = ci.user_id
JOIN public.collections col ON col.id = ci.collection_id
LEFT JOIN public.lines l    ON l.id = ci.line_id
LEFT JOIN public.brands b   ON b.id = l.brand_id
WHERE ci.visibility = 'public'
ORDER BY ci.created_at DESC
LIMIT 10;

GRANT SELECT ON public.last_arrivals TO anon;
GRANT SELECT ON public.last_arrivals TO authenticated;
