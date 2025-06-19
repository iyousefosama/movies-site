import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSuggestions() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Skeleton className="h-[700px] w-full rounded-lg" />
      <div className="mt-8 text-center">
        <LoadingSpinner size={48} />
        <p className="text-muted-foreground mt-2">Loading suggestion form...</p>
      </div>
    </div>
  );
}
