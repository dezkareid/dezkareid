-- Replaces get_slug_options to null-out field slugs that carry no meaningful
-- information (e.g. "Unknown", "N/A", "None"). Mirrors MEANINGLESS_SLUG_PARTS
-- in lib/slug.ts — keep both lists in sync when adding new values.

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

  -- Inline slugify helper (mirrors TypeScript toSlug in lib/slug.ts)
  slug_name      text;
  slug_line      text;
  slug_variant   text;
  slug_brand     text;

  -- Meaningless slug parts that add no disambiguation value.
  -- Mirror of MEANINGLESS_SLUG_PARTS in lib/slug.ts.
  v_meaningless  text[] := ARRAY[
    'unknown', 'unknow', 'n-a', 'na', 'none', 'other',
    'misc', 'miscellaneous', 'tbd', 'tba'
  ];

  c1 text; c2 text; c3 text; c4 text; c5 text; c6 text;
  v_id_slug  text;
  v_attempts int := 0;

BEGIN
  -- Slugify each input, then set to NULL when the result is empty or meaningless.
  slug_name := substr(
    regexp_replace(regexp_replace(lower(unaccent(p_name)), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'),
    1, 60
  );

  slug_line := CASE
    WHEN p_line_name IS NOT NULL THEN
      substr(regexp_replace(regexp_replace(lower(unaccent(p_line_name)), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 30)
    ELSE NULL
  END;
  IF slug_line = '' OR slug_line = ANY(v_meaningless) THEN slug_line := NULL; END IF;

  slug_variant := CASE
    WHEN p_variant IS NOT NULL THEN
      substr(regexp_replace(regexp_replace(lower(unaccent(p_variant)), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 20)
    ELSE NULL
  END;
  IF slug_variant = '' OR slug_variant = ANY(v_meaningless) THEN slug_variant := NULL; END IF;

  slug_brand := CASE
    WHEN p_brand_name IS NOT NULL THEN
      substr(regexp_replace(regexp_replace(lower(unaccent(p_brand_name)), '[^a-z0-9]+', '-', 'g'), '^-+|-+$', '', 'g'), 1, 30)
    ELSE NULL
  END;
  IF slug_brand = '' OR slug_brand = ANY(v_meaningless) THEN slug_brand := NULL; END IF;

  -- Build candidates (NULL when condition not met or field is meaningless)
  c1 := CASE WHEN slug_line IS NOT NULL
              THEN substr(slug_name || '-' || slug_line, 1, 90) ELSE NULL END;

  c2 := CASE WHEN slug_variant IS NOT NULL
              THEN substr(slug_name || '-' || slug_variant, 1, 90) ELSE NULL END;

  c3 := CASE WHEN slug_line IS NOT NULL AND slug_variant IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_variant, 1, 90) ELSE NULL END;

  c4 := CASE WHEN slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_brand, 1, 90) ELSE NULL END;

  c5 := CASE WHEN slug_line IS NOT NULL AND slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_brand, 1, 90) ELSE NULL END;

  c6 := CASE WHEN slug_line IS NOT NULL AND slug_variant IS NOT NULL AND slug_brand IS NOT NULL
              THEN substr(slug_name || '-' || slug_line || '-' || slug_variant || '-' || slug_brand, 1, 90) ELSE NULL END;

  -- Collect taken slugs in one query
  SELECT array_agg(ci.slug)
    INTO v_taken
    FROM collection_items ci
   WHERE ci.collection_id = p_collection_id
     AND (p_exclude_slug IS NULL OR ci.slug <> p_exclude_slug);

  IF v_taken IS NULL THEN v_taken := '{}'; END IF;

  IF c1 IS NOT NULL AND NOT (c1 = ANY(v_taken)) THEN RETURN QUERY SELECT 1, c1, 'name + line'::text; END IF;
  IF c2 IS NOT NULL AND NOT (c2 = ANY(v_taken)) THEN RETURN QUERY SELECT 2, c2, 'name + variant'::text; END IF;
  IF c3 IS NOT NULL AND NOT (c3 = ANY(v_taken)) THEN RETURN QUERY SELECT 3, c3, 'name + line + variant'::text; END IF;
  IF c4 IS NOT NULL AND NOT (c4 = ANY(v_taken)) THEN RETURN QUERY SELECT 4, c4, 'name + brand'::text; END IF;
  IF c5 IS NOT NULL AND NOT (c5 = ANY(v_taken)) THEN RETURN QUERY SELECT 5, c5, 'name + line + brand'::text; END IF;
  IF c6 IS NOT NULL AND NOT (c6 = ANY(v_taken)) THEN RETURN QUERY SELECT 6, c6, 'name + line + variant + brand'::text; END IF;

  -- Priority 7: name + random ID (always present)
  LOOP
    v_id_slug := slug_name || '-' || lower(substr(md5(random()::text), 1, 5));
    EXIT WHEN NOT (v_id_slug = ANY(v_taken));
    v_attempts := v_attempts + 1;
    IF v_attempts > 20 THEN
      v_id_slug := slug_name || '-' || replace(gen_random_uuid()::text, '-', '');
      EXIT;
    END IF;
  END LOOP;
  RETURN QUERY SELECT 7, v_id_slug, 'name + ID'::text;

END;
$$;

GRANT EXECUTE ON FUNCTION public.get_slug_options(uuid, text, text, text, text, text)
  TO authenticated;
