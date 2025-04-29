"use client";

import { Suspense, useDeferredValue } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { useTRPC } from "@/trpc/client";

import {
  SubscriptionsHistoryTable,
  SubscriptionsHistoryTableSkeleton,
} from "./table";

export const SubscriptionsHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="text-xl font-semibold text-foreground">
            Subscription History
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<SubscriptionsHistoryTableSkeleton />}>
            <SubscriptionsHistoryTableSuspense />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};

const SubscriptionsHistoryTableSuspense = () => {
  const trpc = useTRPC();
  const { pagination, sorting, globalFilter } = useInactiveSubscriptionsStore();

  const deferredGlobalFilter = useDeferredValue(globalFilter);
  const isFilterStale = globalFilter !== deferredGlobalFilter;

  const deferredSorting = useDeferredValue(sorting);
  const isSortingStale = sorting !== deferredSorting;

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
  const { data: totalCount } = useSuspenseQuery(
    trpc.subscriptions.countInactive.queryOptions({
      ...(deferredGlobalFilter.length > 0 && {
        globalFilter: deferredGlobalFilter as string,
      }),
    })
  );

  return (
    <SubscriptionsHistoryTable
      subscriptions={subscriptions}
      totalCount={totalCount}
      isStale={isFilterStale || isSortingStale}
    />
  );
};
