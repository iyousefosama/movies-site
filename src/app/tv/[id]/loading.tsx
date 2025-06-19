import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function LoadingTVDetail() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-64 md:h-96 lg:h-[500px] rounded-xl mb-8" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 space-y-6">
          <Skeleton className="aspect-[2/3] rounded-lg" />
          <Skeleton className="h-48 rounded-lg" /> {/* Trailer Placeholder */}
        </div>
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-4">
          <Skeleton className="h-12 w-3/4" /> {/* Title */}
          <Skeleton className="h-6 w-1/2" /> {/* Tagline */}
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-6 w-1/4 mb-2" /> {/* Overview Title */}
          <Skeleton className="h-24 w-full" /> {/* Overview Text */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            ))}
          </div>
          <Skeleton className="h-6 w-1/3 mb-2" /> {/* Networks Title */}
           <div className="flex flex-wrap gap-4 items-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-24 rounded-lg" />
            ))}
          </div>
          <LoadingSpinner className="mt-8" />
        </div>
      </div>
    </div>
  );
}
