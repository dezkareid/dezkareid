-- Returns ranked slug candidates for a new collection item, filtered to slugs
-- not already taken within the given collection.
--
-- Priority order matches the spec:
--   1  name + line
--   2  name + variant
--   3  name + line + variant
--   4  name + brand
--   5  name + line + brand
--   6  name + line + variant + brand
--   7  name + random ID (always present as fallback)
--
-- p_exclude_slug: when set, that slug is excluded from the "taken" check
-- (used to ignore the item's own current slug during edits).

-- unaccent is required for accent-stripping in slug generation
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE OR REPLACE FUNCTION public.get_slug_options(
  p_collection_id uuid,
  p_name          text,
  p_line_name     text    DEFAULT NULL,
  p_variant       text    DEFAULT NULL,
  p_brand_name    text    DEFAULT NULL,
  p_exclude_slug  text    DEFAULT NULL
)
RETURNS TABLE (priority int, slug text, label text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_taken text[];

  -- Inline slugify: lowercase, strip accents, replace non-alphanumeric with '-',
  -- trim leading/trailing dashes, truncate to 60 chars.
  -- Mirrors the TypeScript toSlug() in lib/slug.ts.
  slug_name      text := substr(regexp_replace(regexp_replace(lower(unaccent(p_name)),      '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 60);
  slug_line      text := CASE WHEN p_line_name  IS NOT NULL THEN substr(regexp_replace(regexp_replace(lower(unaccent(p_line_name)),  '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 30) ELSE NULL END;
  slug_variant   text := CASE WHEN p_variant    IS NOT NULL THEN substr(regexp_replace(regexp_replace(lower(unaccent(p_variant)),    '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 20) ELSE NULL END;
  slug_brand     text := CASE WHEN p_brand_name IS NOT NULL THEN substr(regexp_replace(regexp_replace(lower(unaccent(p_brand_name)), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 30) ELSE NULL END;

  -- Candidate slugs per priority
  c1 text; c2 text; c3 text; c4 text; c5 text; c6 text; c7 text;

  v_id_base  text;
  v_id_slug  text;
  v_attempts int := 0;
BEGIN
  -- Build candidates (NULL when condition not met)
  c1 := CASE WHEN slug_line IS NOT NULL
              THEN substr(slug_name || '-' || slug_line, 1, 90)
              ELSE NULL END;

  c2 := CASE WHEN slug_variant IS NOT NULL
              THEN substr(slug_name || '-' || slug_variant, 1, 90)
              ELSE NULL END;

  c3 := CASE WHEN slug_line IS NOT NULL AND slug_variant IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_variant, 1, 90)
              ELSE NULL END;

  c4 := CASE WHEN slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_brand, 1, 90)
              ELSE NULL END;

  c5 := CASE WHEN slug_line IS NOT NULL AND slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_brand, 1, 90)
              ELSE NULL END;

  c6 := CASE WHEN slug_line IS NOT NULL AND slug_variant IS NOT NULL AND slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_variant || '-' || slug_brand, 1, 90)
              ELSE NULL END;

  -- Collect all taken slugs in the collection in one query
  SELECT array_agg(ci.slug)
    INTO v_taken
    FROM collection_items ci
   WHERE ci.collection_id = p_collection_id
     AND (p_exclude_slug IS NULL OR ci.slug <> p_exclude_slug);

  IF v_taken IS NULL THEN
    v_taken := '{}';
  END IF;

  -- Emit each non-NULL candidate that is not already taken
  IF c1 IS NOT NULL AND NOT (c1 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 1, c1, 'name + line'::text;
  END IF;
  IF c2 IS NOT NULL AND NOT (c2 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 2, c2, 'name + variant'::text;
  END IF;
  IF c3 IS NOT NULL AND NOT (c3 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 3, c3, 'name + line + variant'::text;
  END IF;
  IF c4 IS NOT NULL AND NOT (c4 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 4, c4, 'name + brand'::text;
  END IF;
  IF c5 IS NOT NULL AND NOT (c5 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 5, c5, 'name + line + brand'::text;
  END IF;
  IF c6 IS NOT NULL AND NOT (c6 = ANY(v_taken)) THEN
    RETURN QUERY SELECT 6, c6, 'name + line + variant + brand'::text;
  END IF;

  -- Priority 7: name + random alphanumeric ID (retry until free)
  v_id_base := slug_name;
  LOOP
    v_id_slug := v_id_base || '-' || lower(substr(md5(random()::text), 1, 5));
    EXIT WHEN NOT (v_id_slug = ANY(v_taken));
    v_attempts := v_attempts + 1;
    IF v_attempts > 20 THEN
      -- Extremely unlikely; fall back to a longer unique suffix
      v_id_slug := v_id_base || '-' || replace(gen_random_uuid()::text, '-', '');
      EXIT;
    END IF;
  END LOOP;
  RETURN QUERY SELECT 7, v_id_slug, 'name + ID'::text;

END;
$$;

-- Grant execute to authenticated users (RLS on collection_items still applies
-- inside the function via the array_agg query).
GRANT EXECUTE ON FUNCTION public.get_slug_options(uuid, text, text, text, text, text)
  TO authenticated;
