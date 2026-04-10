import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ItemImageSection } from '../ItemImageSection';

type Properties = {
  itemId: string;
  userId: string;
  imageUrl: string | undefined;
  name: string;
  username: string;
  collectionSlug: string;
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Determines ownership server-side and renders ItemImageSection with the
 * correct isOwner value. Wrapped in <Suspense> on the parent page so it
 * streams in without blocking the cached static shell.
 */
export async function OwnerImageSection({ itemId, userId, imageUrl, name, username, collectionSlug }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === userId;

  return (
    <ItemImageSection
      itemId={itemId}
      imageUrl={imageUrl}
      name={name}
      isOwner={isOwner}
      username={username}
      collectionSlug={collectionSlug}
    />
  );
}
