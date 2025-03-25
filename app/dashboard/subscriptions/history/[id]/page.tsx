import { SubscriptionDetail } from "@/components/dashboard/subscriptions/subscription-detail";

import { getSubscription } from "./actions";

export default function SubscriptionHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const subscriptionPromise = getSubscription(params);

  return <SubscriptionDetail subscriptionPromise={subscriptionPromise} />;
}
