
"use client";

import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import { SearchBar } from '@/components/search/SearchBar';
import { Home, Wand2, Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/suggestions', label: 'AI Suggestions', icon: Wand2 },
    { href: '/favorites', label: 'Favorites', icon: Heart },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          {/* Replaced Clapperboard and text with Image */}
          <div className="relative h-8 w-auto"> {/* Adjust h-8 and w-auto as needed */}
            <Image
              src="/logo.png"
              alt="Movista Logo"
              height={32} // Corresponds to h-8
              width={100} // Adjust width as needed for your logo's aspect ratio
              className="object-contain"
              priority
              data-ai-hint="logo"
            />
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-out hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-foreground"
                )}
              >
                <item.icon className="inline-block h-5 w-5 mr-1.5 mb-0.5" />
                {item.label}
                {isActive && (
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeNavUnderline" 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="w-full flex-1 md:flex-none md:w-auto md:max-w-md ml-4">
          <SearchBar placeholder="Search Movista..." />
        </div>
      </div>
    </header>
  );
}
