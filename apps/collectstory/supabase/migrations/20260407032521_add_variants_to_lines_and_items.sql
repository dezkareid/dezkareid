-- Add variants array to lines (default empty array)
-- Each element: { "value": string, "display_name": string }
ALTER TABLE lines ADD COLUMN IF NOT EXISTS variants jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Add variant value to collection_items (nullable text, stores the variant.value string)
ALTER TABLE collection_items ADD COLUMN IF NOT EXISTS variant text;
