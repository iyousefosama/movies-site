"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <Header />
      <main className={`flex-grow ${isHomePage ? 'w-full p-0 m-0' : 'container mx-auto px-4 pt-20 sm:pt-24 pb-12'}`}>
        {children}
      </main>
    </>
  );
}
 