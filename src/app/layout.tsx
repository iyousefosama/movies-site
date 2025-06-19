import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Movista - Discover Your Next Favorite Movie',
  description: 'A modern, sleek movie discovery website.',
  icons: {
    icon: '/favicon.ico', // Assuming you might add a favicon later
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts links are managed by next/font, no need for manual <link> tags here if using next/font */}
      </head>
      <body className={`${inter.variable} font-body antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Providers>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
