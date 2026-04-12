import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { OwnerImageActions } from './OwnerImageActions';

type Properties = {
  itemId: string;
  userId: string;
  username: string;
  collectionSlug: string;
  imageUrl: string | undefined;
};

/**
 * Dynamic Server Component — always rendered fresh, never cached.
 * Determines ownership server-side and renders OwnerImageActions.
 */
export async function OwnerImageSection({ itemId, userId, username, collectionSlug, imageUrl }: Properties) {
  await connection();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = user?.id === userId;

  if (!isOwner) return;

  return (
    <OwnerImageActions
      itemId={itemId}
      isOwner={isOwner}
      username={username}
      collectionSlug={collectionSlug}
      hasImage={!!imageUrl}
    />
  );
}
