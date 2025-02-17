"use client";

import { Suspense } from "react";

import { ErrorBoundary } from "react-error-boundary";

import { trpc } from "@/trpc/client";

import { SubscriptionScheduledBanner } from "./subscription-scheduled-banner";
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
  const [activeSubscription] = trpc.subscriptions.getActive.useSuspenseQuery();

  return (
    <>
      <UserProfileSection activeSubscription={activeSubscription} />
      <SubscriptionScheduledBanner activeSubscription={activeSubscription} />
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
