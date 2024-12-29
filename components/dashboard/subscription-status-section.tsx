import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";
import { SubscriptionActions } from "./subscription-actions";
import { Subscription, Price, Product } from "@prisma/client";

interface SubscriptionWithDetails extends Subscription {
  product: Product;
  price: Price;
}

interface SubscriptionStatusSectionProps {
  subscription: SubscriptionWithDetails | undefined;
}

export function getStatusBadgeColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "trialing":
      return "bg-blue-100 text-blue-800";
    case "past_due":
      return "bg-yellow-100 text-yellow-800";
    case "paused":
      return "bg-gray-100 text-gray-800";
    case "canceled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getStatusText(status: string) {
  switch (status.toLowerCase()) {
    case "trialing":
      return "Trial Period";
    case "past_due":
      return "Payment Due";
    case "paused":
      return "Paused";
    case "canceled":
      return "Canceled";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function SubscriptionStatusSection({
  subscription,
}: SubscriptionStatusSectionProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Subscription Status</h2>
        {subscription && (
          <div className="flex space-x-2">
            <SubscriptionActions
              status={subscription.status.toLowerCase()}
              subscriptionId={subscription.paddle_subscription_id}
              billingInterval={subscription.billing_cycle_interval.toLowerCase()}
              scheduledChange={subscription.scheduled_change as any}
            />
          </div>
        )}
      </div>
      {subscription ? (
        <div className="space-y-4">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(
                subscription.status
              )}`}
            >
              {getStatusText(subscription.status)}
            </span>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-700 font-medium">
              Plan: {subscription.product.name}
            </p>
            <p className="text-gray-700">
              Price:{" "}
              {formatPrice(
                subscription.price_amount,
                subscription.price_currency
              )}
              /{subscription.billing_cycle_interval.toLowerCase()}
            </p>
            {subscription.trial_ends_at && (
              <p className="text-gray-700">
                Trial ends: {formatDate(subscription.trial_ends_at)}
              </p>
            )}
            {subscription.renews_at && (
              <p className="text-gray-700">
                Next billing date: {formatDate(subscription.renews_at)}
              </p>
            )}
            {subscription.ends_at && (
              <p className="text-gray-700">
                Subscription ends: {formatDate(subscription.ends_at)}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-600">
            You don't have an active subscription.
          </p>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </div>
      )}
    </div>
  );
}
