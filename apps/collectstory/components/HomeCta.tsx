'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Properties = {
  primaryClassName: string;
};

export function HomeCTA({ primaryClassName }: Properties) {
  const [href, setHref] = useState('/login');
  const [label, setLabel] = useState('Sign In to Your Collection');

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
          if (data?.username) {
            setHref(`/${data.username}`);
            setLabel('Go to My Collections');
          }
          else {
            setHref('/collection');
            setLabel('Go to My Collection');
          }
        });
    });
  }, []);

  return (
    <Link href={href} className={primaryClassName}>
      {label}
    </Link>
  );
}
