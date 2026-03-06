import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import ClerkProviderWrapper from '@/providers/ClerkProviderWrapper';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Store Admin',
  description: 'Store Admin',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWrapper>
      <html lang='en' suppressHydrationWarning>
        <body className='antialiased'>
          <QueryProvider>
            <Toaster position='top-right' richColors />
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProviderWrapper>
  );
}
