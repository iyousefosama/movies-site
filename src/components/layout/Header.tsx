
"use client";

import Link from 'next/link';
import { SearchBar } from '@/components/search/SearchBar';
import { Clapperboard, Home, Wand2, Heart } from 'lucide-react'; // Added Heart
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/suggestions', label: 'AI Suggestions', icon: Wand2 },
    { href: '/favorites', label: 'Favorites', icon: Heart }, // Added Favorites link
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
          <Clapperboard className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold">Movista</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-2"> {/* Use space-x-2 or space-x-4 for more spacing */}
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ease-out hover:text-primary", // Increased px-4
                  isActive ? "text-primary font-semibold" : "text-foreground/80 hover:text-foreground" // Slightly brighter non-active
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

        <div className="w-full flex-1 md:flex-none md:w-auto md:max-w-md ml-4"> {/* Adjusted width and flex behavior */}
          <SearchBar placeholder="Search Movista..." />
        </div>
      </div>
    </header>
  );
}
