"use client";

import { Suspense } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { useTRPC } from "@/trpc/client";

import {
  SubscriptionHistoryPagination,
  SubscriptionHistoryPaginationSkeleton,
} from "./subscription-history-pagination";
import {
  SubscriptionHistoryTableSection,
  SubscriptionHistoryTableSectionSkeleton,
} from "./subscription-history-table-section";

export const InactiveSubscriptionSections = () => {
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
          <Suspense fallback={<SubscriptionHistoryTableSectionSkeleton />}>
            <SubscriptionHistoryTableSectionSuspense />
          </Suspense>
        </ErrorBoundary>
      </CardContent>
      <CardFooter>
        <ErrorBoundary fallback={<div>Error</div>}>
          <Suspense fallback={<SubscriptionHistoryPaginationSkeleton />}>
            <SubscriptionHistoryPaginationSuspense />
          </Suspense>
        </ErrorBoundary>
      </CardFooter>
    </Card>
  );
};

const SubscriptionHistoryTableSectionSuspense = () => {
  const trpc = useTRPC();
  const { currentPage, sortParams } = useInactiveSubscriptionsStore();
  const { data: subscriptions } = useSuspenseQuery(
    trpc.subscriptions.getInactive.queryOptions({
      limit: SUBSCRIPTION_HISTORY_PAGE_SIZE,
      page: currentPage,
      sortParams,
    })
  );

  return <SubscriptionHistoryTableSection subscriptions={subscriptions} />;
};

const SubscriptionHistoryPaginationSuspense = () => {
  const trpc = useTRPC();
  const { data: totalCount } = useSuspenseQuery(
    trpc.subscriptions.countInactive.queryOptions()
  );

  return <SubscriptionHistoryPagination totalCount={totalCount} />;
};
