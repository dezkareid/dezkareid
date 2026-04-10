import { createClient } from '@/lib/supabase/server';
import { getItemLikedByUser } from '@/lib/collections';
import { LikeButton } from '@/src/features/like-item';

type Properties = {
  itemId: string;
  likesCount: number;
  isPublic: boolean;
};

export async function LikeSection({
  itemId,
  likesCount,
  isPublic,
}: Properties) {
  if (!isPublic) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthenticated = !!user;
  const initialLiked = user ? await getItemLikedByUser(itemId, user.id) : false;

  return (
    <LikeButton
      itemId={itemId}
      initialCount={likesCount}
      initialLiked={initialLiked}
      isAuthenticated={isAuthenticated}
    />
  );
}
