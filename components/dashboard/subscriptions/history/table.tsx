import { useDeferredValue, useEffect } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { useTRPC } from "@/trpc/client";
import { SubscriptionsGetInactiveOutputSingle } from "@/trpc/types";

interface SubscriptionsHistoryTableProps {
  table: Table<SubscriptionsGetInactiveOutputSingle>;
  setSubscriptions: (
    subscriptions: SubscriptionsGetInactiveOutputSingle[]
  ) => void;
}

export function SubscriptionsHistoryTable({
  table,
  setSubscriptions,
}: SubscriptionsHistoryTableProps) {
  const trpc = useTRPC();
  const { pagination, sorting, globalFilter } = useInactiveSubscriptionsStore();

  const deferredGlobalFilter = useDeferredValue(globalFilter);
  const deferredSorting = useDeferredValue(sorting);
  const isStale =
    deferredGlobalFilter !== globalFilter || deferredSorting !== sorting;

  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscriptions.getInactive.queryOptions({
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      ...(deferredSorting.length > 0 && {
        sortingId: deferredSorting[0].id as
          | "productName"
          | "billingCycleInterval"
          | "priceAmount"
          | "startsAt"
          | "endsAt"
          | "status",
        sortingDirection: deferredSorting[0].desc ? "desc" : "asc",
      }),
      ...(deferredGlobalFilter.length > 0 && {
        globalFilter: deferredGlobalFilter as string,
      }),
    })
  );

  useEffect(() => {
    if (subscriptions) {
      setSubscriptions(subscriptions);
    }
  }, [subscriptions, setSubscriptions]);

  return (
    <div
      style={{
        opacity: isStale ? 0.5 : 1,
        transition: isStale
          ? "opacity 0.2s 0.2s linear"
          : "opacity 0s 0s linear",
      }}
    >
      <DataTable table={table} />
    </div>
  );
}

export const SubscriptionsHistoryTableSkeleton = () => {
  // Column widths for realistic appearance
  const columnWidths = [
    "w-[15%]", // Product Name
    "w-[10%]", // Status
    "w-[15%]", // Billing Cycle
    "w-[15%]", // Price
    "w-[15%]", // Start Date
    "w-[15%]", // End Date
    "w-[5%]", // Actions
  ];

  return (
    <div className="rounded-md border overflow-hidden">
      {/* Table header */}
      <div className="h-12 border-b bg-muted/30 px-4">
        <div className="flex h-full items-center gap-4">
          {columnWidths.map((width, i) => (
            <Skeleton
              key={`header-${i}`}
              className={`h-4 ${width} rounded-md`}
            />
          ))}
        </div>
      </div>

      {/* Fixed number of skeleton rows */}
      <div>
        {Array.from({ length: SUBSCRIPTION_HISTORY_PAGE_SIZE }).map((_, i) => (
          <div
            key={`row-${i}`}
            className="border-b px-4 py-4 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              {columnWidths.map((width, j) => (
                <Skeleton
                  key={`cell-${i}-${j}`}
                  className={`h-5 ${width} rounded-md ${
                    j === 0 ? "bg-muted/60" : "bg-muted/40"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
