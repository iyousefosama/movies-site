// "use client"; // This is now a server component
import type { Metadata, Viewport } from 'next'; // Keep for potential future use if client component structure changes
import { Inter } from 'next/font/google';
import './globals.css';
// import { Header } from '@/components/layout/Header'; // Moved to ClientLayout
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { FavoritesProvider } from '@/context/FavoritesContext'; // Added import
// import { usePathname } from 'next/navigation'; // Moved to ClientLayout
import { ClientLayout } from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Movista - Discover Your Next Favorite Movie',
    template: '%s | Movista',
  },
  description: 'A modern, sleek movie discovery website. Get AI-powered movie and TV show recommendations.',
  keywords: [
    'movies', 'tv shows', 'recommendations', 'AI', 'Next.js', 'TMDB', 'movie app', 'movie discovery'
  ],
  metadataBase: new URL('https://movista.vercel.app/'),
  openGraph: {
    title: 'Movista - Discover Your Next Favorite Movie',
    description: 'A modern, sleek movie discovery website. Get AI-powered movie and TV show recommendations.',
    url: 'https://movista.vercel.app/',
    siteName: 'Movista',
    images: [
      {
        url: '/movista.jpg', // Place a suitable image in /public
        width: 1200,
        height: 630,
        alt: 'Movista - Discover Your Next Favorite Movie',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movista - Discover Your Next Favorite Movie',
    description: 'A modern, sleek movie discovery website. Get AI-powered movie and TV show recommendations.',
    images: ['/movista.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png', // Optional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const pathname = usePathname(); // Logic moved to ClientLayout
  // const isHomePage = pathname === '/'; // Logic moved to ClientLayout

  return (
    <html lang="en" className="dark">
      <head>
        {/* Metadata is now handled by Next.js metadata API */}
      </head>
      <body className={`${inter.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Providers>
          <FavoritesProvider>
            <ClientLayout>{children}</ClientLayout>
            <Footer />
            <Toaster />
          </FavoritesProvider>
        </Providers>
      </body>
    </html>
  );
}
