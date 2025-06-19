
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSearchResults() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-10 w-1/2" /> {/* Placeholder for title */}
        <div className="flex gap-4">
          <Skeleton className="h-9 w-[150px]" /> {/* Sort by dropdown */}
          <Skeleton className="h-9 w-[120px]" /> {/* Sort order dropdown */}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 18 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] bg-card rounded-lg" />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <Skeleton className="h-10 w-32" /> {/* Pagination placeholder */}
      </div>
    </div>
  );
}
