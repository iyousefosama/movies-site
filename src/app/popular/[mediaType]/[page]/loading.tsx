import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoadingPopularPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-1/3 bg-muted rounded animate-pulse mb-6"></div> {/* Placeholder for title */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="aspect-[2/3] bg-card rounded-lg animate-pulse"></div>
        ))}
      </div>
      <LoadingSpinner className="mt-8" />
    </div>
  );
}
