
import { Skeleton } from "@/components/ui/skeleton";

export const ArticleCardSkeleton = () => {
  return (
    <div className="article-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
};
