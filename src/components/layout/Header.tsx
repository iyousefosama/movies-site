"use client";

import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { Clapperboard, Home, Lightbulb } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <Clapperboard className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold">Movista</span>
        </Link>
        
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary/90",
                pathname === item.href ? "text-primary font-semibold" : "text-foreground/60"
              )}
            >
              <item.icon className="inline-block h-5 w-5 mr-1 mb-0.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="w-full max-w-xs">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
