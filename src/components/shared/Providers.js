'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 10 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
            refetchOnMount: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position='top-right' expand={false} richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
