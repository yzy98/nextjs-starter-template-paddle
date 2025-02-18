"use client";

import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { useInactiveSubscriptionsStore } from "@/stores/use-inactive-subscriptions-store";
import { trpc } from "@/trpc/client";

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
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Subscription History
        </h2>
      </div>
      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<SubscriptionHistoryTableSectionSkeleton />}>
          <SubscriptionHistoryTableSectionSuspense />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<div>Error</div>}>
        <Suspense fallback={<SubscriptionHistoryPaginationSkeleton />}>
          <SubscriptionHistoryPaginationSuspense />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const SubscriptionHistoryTableSectionSuspense = () => {
  const { currentPage, sortParams } = useInactiveSubscriptionsStore();
  const [subscriptions] = trpc.subscriptions.getInactive.useSuspenseQuery({
    limit: SUBSCRIPTION_HISTORY_PAGE_SIZE,
    page: currentPage,
    sortParams,
  });

  return <SubscriptionHistoryTableSection subscriptions={subscriptions} />;
};

const SubscriptionHistoryPaginationSuspense = () => {
  const [totalCount] = trpc.subscriptions.countInactive.useSuspenseQuery();

  return <SubscriptionHistoryPagination totalCount={totalCount} />;
};
