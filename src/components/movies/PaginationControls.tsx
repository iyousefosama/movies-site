"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Number of page links to show (e.g., 1, 2, 3, ..., 10)
  
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <Button asChild variant="outline" size="icon" disabled={currentPage <= 1}>
        <Link href={`${basePath}/${currentPage - 1}`} aria-label="Previous page">
          <ChevronLeft className="h-5 w-5" />
        </Link>
      </Button>

      {startPage > 1 && (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}/1`}>1</Link>
          </Button>
          {startPage > 2 && <span className="text-muted-foreground">...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <Button
          key={page}
          asChild
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          className={cn(currentPage === page && "bg-primary text-primary-foreground hover:bg-primary/90")}
        >
          <Link href={`${basePath}/${page}`}>{page}</Link>
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-muted-foreground">...</span>}
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}/${totalPages}`}>{totalPages}</Link>
          </Button>
        </>
      )}
      
      <Button asChild variant="outline" size="icon" disabled={currentPage >= totalPages}>
        <Link href={`${basePath}/${currentPage + 1}`} aria-label="Next page">
          <ChevronRight className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
