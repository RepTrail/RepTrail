'use client';

import { QueryClient } from '@/lib/dal';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryPersister } from '@/lib/query-persister';
import { ReactNode, useState } from 'react';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias de persistência local offline
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
