"use client";

import { Suspense, useState } from "react";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { ErrorBoundary } from "react-error-boundary";

import { columns } from "@/components/dashboard/subscriptions/history/columns";
import { SubscriptionsHistoryPagination } from "@/components/dashboard/subscriptions/history/pagination";
import {
  SubscriptionsHistoryTable,
  SubscriptionsHistoryTableSkeleton,
} from "@/components/dashboard/subscriptions/history/table";
import { DataTableFilter } from "@/components/ui/data-table/data-table-filter";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import {
  SubscriptionsCountInactiveOutput,
  SubscriptionsGetInactiveOutput,
} from "@/trpc/types";

export const SubscriptionsHistoryContent = () => {
  const {
    pagination,
    setPagination,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
  } = useInactiveSubscriptionsStore();

  const [subscriptions, setSubscriptions] =
    useState<SubscriptionsGetInactiveOutput>([]);
  const [totalCount, setTotalCount] =
    useState<SubscriptionsCountInactiveOutput>(0);

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
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<SubscriptionsHistoryTableSkeleton />}>
          <SubscriptionsHistoryTable
            table={table}
            setSubscriptions={setSubscriptions}
          />
        </Suspense>
      </ErrorBoundary>
      <SubscriptionsHistoryPagination
        table={table}
        setTotalCount={setTotalCount}
      />
    </div>
  );
};
