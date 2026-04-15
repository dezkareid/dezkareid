'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Properties = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: Properties) {
  // Create QueryClient inside useState so each request gets its own instance.
  // Module-level instantiation would share state across requests on the server.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
