"use client";

import { Suspense } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/trpc/client";

import { SubscriptionStatusCard, SubscriptionStatusCardSkeleton } from "./card";

export const SubscriptionsStatus = () => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<SubscriptionsStatusSkeleton />}>
        <SubscriptionsStatusSuspense />
      </Suspense>
    </ErrorBoundary>
  );
};

const SubscriptionsStatusSuspense = () => {
  const trpc = useTRPC();
  const { data: activeSubscription } = useSuspenseQuery(
    trpc.subscriptions.getActive.queryOptions()
  );

  return <SubscriptionStatusCard activeSubscription={activeSubscription} />;
};

const SubscriptionsStatusSkeleton = () => {
  return <SubscriptionStatusCardSkeleton />;
};
