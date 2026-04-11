CREATE OR REPLACE FUNCTION public.search_catalog_items(
  query     text,
  max_results int DEFAULT 10
)
RETURNS TABLE (
  id           uuid,
  name         text,
  slug         text,
  image_url    text,
  franchise_id uuid,
  franchise_name text,
  line_id      uuid,
  line_name    text,
  score        real
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    ci.id,
    ci.name,
    ci.slug,
    ci.image_url,
    ci.franchise_id,
    f.name  AS franchise_name,
    ci.line_id,
    l.name  AS line_name,
    similarity(ci.name, query) AS score
  FROM public.catalog_items ci
  LEFT JOIN public.franchises f ON f.id = ci.franchise_id
  LEFT JOIN public.lines      l ON l.id = ci.line_id
  WHERE
    ci.name ILIKE '%' || query || '%'
    OR similarity(ci.name, query) > 0.1
  ORDER BY score DESC, ci.name ASC
  LIMIT max_results;
$$;

-- Grant execute to anon and authenticated roles so the Route Handler can call it
GRANT EXECUTE ON FUNCTION public.search_catalog_items(text, int) TO anon, authenticated;
