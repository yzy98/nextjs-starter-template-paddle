import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { inferProcedureOutput } from "@trpc/server";

import { DataTable } from "@/components/ui/data-table";
import { DataTableFilter } from "@/components/ui/data-table/data-table-filter";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { Skeleton } from "@/components/ui/skeleton";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { AppRouter } from "@/trpc/routers/_app";

import { columns } from "./columns";

type SubscriptionsHistoryOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

interface SubscriptionsHistoryOutputTableProps {
  subscriptions: SubscriptionsHistoryOutput;
  totalCount: number;
}

export const SubscriptionsHistoryTable = ({
  subscriptions,
  totalCount,
}: SubscriptionsHistoryOutputTableProps) => {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
  } = useInactiveSubscriptionsStore();

  const table = useReactTable({
    data: subscriptions,
    columns,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    state: {
      pagination,
      sorting,
      globalFilter,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    onSortingChange: setSorting,
    manualSorting: true,
    enableMultiSort: false,
    onGlobalFilterChange: setGlobalFilter,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center">
        <DataTableFilter table={table} />
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} />
      <DataTablePagination table={table} />
    </div>
  );
};

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
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        {/* Filter skeleton */}
        <Skeleton className="h-10 w-[220px] sm:w-[250px]" />

        {/* View options skeleton */}
        <Skeleton className="h-10 w-[120px] sm:w-[120px]" />
      </div>

      {/* Table skeleton */}
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
          {Array.from({ length: SUBSCRIPTION_HISTORY_PAGE_SIZE }).map(
            (_, i) => (
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
            )
          )}
        </div>
      </div>

      {/* Pagination skeleton */}
      <div className="flex items-center justify-between px-2">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[120px]" />
      </div>
    </div>
  );
};
