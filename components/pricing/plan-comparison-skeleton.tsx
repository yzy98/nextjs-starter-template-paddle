import { Skeleton } from "@/components/ui/skeleton";

export function PlanComparisonSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-border py-4"
          >
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-6 w-10" />
            <Skeleton className="h-6 w-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
