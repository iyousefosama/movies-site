import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.32))]"> {/* Adjust height based on header/footer */}
      <LoadingSpinner size={64} />
    </div>
  );
}
