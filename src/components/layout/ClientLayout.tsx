"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ReactNode } from 'react';

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      {!isHomePage && <Header />}
      <main className={`flex-grow container mx-auto px-4 ${isHomePage ? 'py-0' : 'py-8'}`}>
        {children}
      </main>
    </>
  );
} 