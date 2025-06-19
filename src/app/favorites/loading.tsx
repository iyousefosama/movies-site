
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingFavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-1/3 mb-8" /> {/* Placeholder for title */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="aspect-[2/3] bg-card rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <LoadingSpinner className="mt-8" />
    </div>
  );
}
