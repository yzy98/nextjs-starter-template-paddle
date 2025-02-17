"use client";

import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import {
  SubscriptionHistorySection,
  SubscriptionHistorySectionSkeleton,
} from "./subscription-history-section";

export const InactiveSubscriptionSections = () => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<InactiveSubscriptionSectionsSkeleton />}>
        <InactiveSubscriptionSectionsSuspense />
      </Suspense>
    </ErrorBoundary>
  );
};

const InactiveSubscriptionSectionsSuspense = () => {
  const [subscriptions] = trpc.subscriptions.getInactive.useSuspenseQuery();

  return (
    <>
      <SubscriptionHistorySection subscriptions={subscriptions} />
    </>
  );
};

const InactiveSubscriptionSectionsSkeleton = () => {
  return (
    <>
      <SubscriptionHistorySectionSkeleton />
    </>
  );
};
