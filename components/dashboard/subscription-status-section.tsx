import { inferProcedureOutput } from "@trpc/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatPrice, getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";

import { SubscriptionActions } from "./subscription-actions";

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getActive"]
>;

interface SubscriptionStatusSectionProps {
  activeSubscription: SubscriptionOutput;
}

export const SubscriptionStatusSection = ({
  activeSubscription,
}: SubscriptionStatusSectionProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Subscription Status
        </h2>
        {activeSubscription && (
          <div className="flex space-x-2">
            <SubscriptionActions
              status={activeSubscription.status.toLowerCase()}
              subscriptionId={activeSubscription.paddle_subscription_id}
              billingInterval={activeSubscription.billing_cycle_interval.toLowerCase()}
              scheduledChange={activeSubscription.scheduled_change as any}
            />
          </div>
        )}
      </div>
      {activeSubscription ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <Badge variant="active">
              {getStatusText(activeSubscription.status)}
            </Badge>
          </div>
          <div className="border-t border-border pt-4">
            <p className="text-foreground font-medium">
              Plan: {activeSubscription.product.name}
            </p>
            <p className="text-muted-foreground">
              Price:{" "}
              {formatPrice(
                activeSubscription.price_amount.toString(),
                activeSubscription.price_currency
              )}
              /{activeSubscription.billing_cycle_interval.toLowerCase()}
            </p>
            {activeSubscription.trial_ends_at && (
              <p className="text-muted-foreground">
                Trial ends: {formatDate(activeSubscription.trial_ends_at)}
              </p>
            )}
            {activeSubscription.renews_at && (
              <p className="text-muted-foreground">
                Next billing date: {formatDate(activeSubscription.renews_at)}
              </p>
            )}
            {activeSubscription.ends_at && (
              <p className="text-muted-foreground">
                Subscription ends: {formatDate(activeSubscription.ends_at)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            You don&apos; have an active subscription.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export const SubscriptionStatusSectionSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-9" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="border-t border-border pt-4 space-y-2">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-56" />
        </div>
      </div>
    </div>
  );
};
