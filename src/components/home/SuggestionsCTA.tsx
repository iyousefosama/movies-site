
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Wand2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function SuggestionsCTA() {
  return (
    <motion.section 
      className="py-16 md:py-24 bg-gradient-to-br from-background via-card/50 to-background rounded-xl shadow-2xl border border-primary/20 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6 text-center relative">
        <motion.div 
          variants={itemVariants}
          className="absolute -top-12 -left-12 text-primary/10"
        >
          <Sparkles className="w-32 h-32  transform rotate-[-15deg]" />
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="absolute -bottom-16 -right-12 text-accent/10"
        >
          <Wand2 className="w-40 h-40 transform rotate-[20deg]" />
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative z-10">
          <Wand2 className="mx-auto h-16 w-16 text-primary mb-6" />
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6"
        >
          Unlock <span className="text-primary">AI-Powered</span> Movie Suggestions
        </motion.h2>

        <motion.p 
          variants={itemVariants}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Tired of endless scrolling? Let our intelligent AI analyze your tastes and recommend movies you&apos;re genuinely going to love.
        </motion.p>

        <motion.div variants={itemVariants}>
          <Button 
            asChild 
            size="lg" 
            className="text-lg py-7 px-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-lg hover:shadow-primary/40 transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/suggestions">
              <Sparkles className="w-6 h-6 mr-3" />
              Discover Your Next Favorite
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
