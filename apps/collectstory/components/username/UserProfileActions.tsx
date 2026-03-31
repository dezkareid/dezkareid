'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CreateCollectionModal } from '@/components/CreateCollectionModal/CreateCollectionModal';

type Properties = {
  username: string;
};

export function UserProfileActions({ username }: Properties) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.username === username) setIsOwner(true);
        });
    });
  }, [username]);

  if (!isOwner) return;

  return <CreateCollectionModal username={username} />;
}
