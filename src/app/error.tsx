"use client"; 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[calc(100vh-theme(spacing.32))]">
      <AlertTriangle className="w-24 h-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold text-destructive mb-4">Oops! Something went wrong.</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        {error.message || "We encountered an unexpected issue. Please try again later."}
      </p>
      <Button
        onClick={() => reset()}
        size="lg"
        variant="destructive"
        className="bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        Try again
      </Button>
    </div>
  );
}
