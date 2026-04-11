export interface CatalogItemSearchResult {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  franchise_id: string | null;
  franchise_name: string | null;
  line_id: string | null;
  line_name: string | null;
  score: number;
}
