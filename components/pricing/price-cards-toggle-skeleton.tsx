import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PriceCardsToggleSkeleton() {
  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      {/* Toggle section */}
      <Skeleton className="h-8 w-[100px] rounded-sm mb-8" />

      {/* Price cards section */}
      <div className="isolate mx-auto grid grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="rounded-[22px] bg-card/90 border border-border"
          >
            <div className="flex gap-6 flex-col p-1 rounded-xl">
              <Skeleton className="h-[22px] mx-8 mt-8 w-[250px] lg:w-[320px]" />
              <Skeleton className="h-[64px] mx-8 mt-6 w-[200px] lg:w-[250px]" />
              <Skeleton className="h-[14px] mx-8 mt-2 w-[150px] lg:w-[200px]" />
              <div className={"px-8"}>
                <Separator className={"bg-border"} />
              </div>
              <div className="px-8 min-h-[200px] min-w-[250px] lg:min-w-[350px]">
                <Skeleton className="h-[24px] w-[180px] mb-6" />
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="size-4 rounded-full" />
                      <Skeleton className="h-[20px] w-[200px]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-8 pt-6">
              <Skeleton className="h-[40px] w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
