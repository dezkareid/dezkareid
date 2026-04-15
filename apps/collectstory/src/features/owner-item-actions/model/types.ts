export type OwnerItem = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  date_acquired: string | null;
  likes_count: number;
  lines: {
    id: string;
    name: string;
    brands: { id: string; name: string } | null;
    categories: { name: string } | null;
    variants: unknown[];
  } | null;
};
