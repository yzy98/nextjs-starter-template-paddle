"use client";

import { Suspense } from "react";

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

  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscriptions.getInactive.queryOptions({
      limit: pagination.pageSize,
      page: pagination.pageIndex,
      ...(sorting.length > 0 && {
        sortingId: sorting[0].id as
          | "productName"
          | "billingCycleInterval"
          | "priceAmount"
          | "startsAt"
          | "endsAt"
          | "status",
        sortingDirection: sorting[0].desc ? "desc" : "asc",
      }),
      ...(globalFilter.length > 0 && {
        globalFilter: globalFilter as string,
      }),
    })
  );
  const { data: totalCount } = useSuspenseQuery(
    trpc.subscriptions.countInactive.queryOptions({
      ...(globalFilter.length > 0 && {
        globalFilter: globalFilter as string,
      }),
    })
  );

  return (
    <SubscriptionsHistoryTable
      subscriptions={subscriptions}
      totalCount={totalCount}
    />
  );
};
