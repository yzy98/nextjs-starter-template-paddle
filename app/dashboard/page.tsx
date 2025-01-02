"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { Subscription, Product, Price, User } from "@prisma/client";

import { UserProfileSection } from "@/components/dashboard/user-profile-section";
import { SubscriptionStatusSection } from "@/components/dashboard/subscription-status-section";
import { SubscriptionHistorySection } from "@/components/dashboard/subscription-history-section";
import { SubscriptionScheduledBanner } from "@/components/dashboard/subscription-scheduled-banner";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";

type ScheduledChange = {
  action: "pause" | "cancel";
  effective_at: string;
  resume_at: string | null;
};

interface UserWithSubscriptions extends User {
  subscriptions: Array<
    Subscription & {
      product: Product;
      price: Price;
      scheduled_change: ScheduledChange | null;
    }
  >;
}

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }
    return res.json();
  });

export default function Dashboard() {
  const router = useRouter();
  const {
    data: user,
    error,
    isLoading,
  } = useSWR<UserWithSubscriptions>("/api/user", fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    onError: (err) => {
      if (err.message === "Unauthorized") {
        router.push("/sign-in");
      }
    },
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !user) {
    return null;
  }

  const activeSubscription = user.subscriptions.find((sub) =>
    ["active", "trialing", "past_due", "paused"].includes(
      sub.status.toLowerCase()
    )
  );

  const historicalSubscriptions = user.subscriptions.filter(
    (sub) =>
      sub.paddle_subscription_id !== activeSubscription?.paddle_subscription_id
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <div className="space-y-4 md:space-y-6">
        <UserProfileSection accountType={activeSubscription?.product?.name} />

        {activeSubscription?.scheduled_change && (
          <SubscriptionScheduledBanner
            action={activeSubscription.scheduled_change.action}
            effectiveDate={activeSubscription.scheduled_change.effective_at}
            subscriptionId={activeSubscription.paddle_subscription_id}
          />
        )}

        <SubscriptionStatusSection subscription={activeSubscription} />

        <SubscriptionHistorySection subscriptions={historicalSubscriptions} />
      </div>
    </div>
  );
}
