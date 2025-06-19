
"use client"; // Required for usePathname

import type { Metadata } from 'next'; // Keep for potential future use if client component structure changes
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { FavoritesProvider } from '@/context/FavoritesContext'; // Added import
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Metadata can't be dynamic in a client component at the root layout level easily.
// For dynamic titles based on path, individual page.tsx files should export 'metadata'.
// export const metadata: Metadata = {
// title: 'Movista - Discover Your Next Favorite Movie',
// description: 'A modern, sleek movie discovery website.',
// icons: {
// icon: '/favicon.ico', 
// }
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en" className="dark">
      <head>
        {/* Basic static metadata for the app */}
        <title>Movista - Discover Your Next Favorite Movie</title>
        <meta name="description" content="A modern, sleek movie discovery website." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Providers>
          <FavoritesProvider> {/* Added FavoritesProvider */}
            {!isHomePage && <Header />} {/* Conditionally render Header */}
            <main className={`flex-grow container mx-auto px-4 ${isHomePage ? 'py-0' : 'py-8'}`}>
              {children}
            </main>
            <Footer />
            <Toaster />
          </FavoritesProvider>
        </Providers>
      </body>
    </html>
  );
}
