"use client";

import { Suspense } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

import { useTRPC } from "@/trpc/client";

import {
  SubscriptionStatusSection,
  SubscriptionStatusSectionSkeleton,
} from "./subscription-status-section";
import {
  UserProfileSection,
  UserProfileSectionSkeleton,
} from "./user-profile-section";

export const ActiveSubscriptionSections = () => {
  return (
    <ErrorBoundary fallback={<div>Error</div>}>
      <Suspense fallback={<ActiveSubscriptionSectionsSkeleton />}>
        <ActiveSubscriptionSectionsSuspense />
      </Suspense>
    </ErrorBoundary>
  );
};

const ActiveSubscriptionSectionsSuspense = () => {
  const trpc = useTRPC();
  const { data: activeSubscription } = useSuspenseQuery(
    trpc.subscriptions.getActive.queryOptions()
  );

  return (
    <>
      <UserProfileSection activeSubscription={activeSubscription} />
      <SubscriptionStatusSection activeSubscription={activeSubscription} />
    </>
  );
};

const ActiveSubscriptionSectionsSkeleton = () => {
  return (
    <>
      <UserProfileSectionSkeleton />
      <SubscriptionStatusSectionSkeleton />
    </>
  );
};
