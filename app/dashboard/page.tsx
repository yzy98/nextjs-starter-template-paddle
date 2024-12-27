import prisma from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SubscriptionActions } from "@/components/dashboard/subscription-actions";
import { SubscriptionScheduledBanner } from "@/components/dashboard/subscription-scheduled-banner";

type ScheduledChange = {
  action: "pause" | "cancel";
  effective_at: string;
  resume_at: string | null;
};

const getStatusBadgeColor = (status: string) => {
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
};

const getStatusText = (status: string) => {
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
};

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerk_id: userId,
    },
    include: {
      subscriptions: {
        include: {
          product: true,
          price: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/sign-in");
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* User Profile Section */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            {user.profile_image_url && (
              <img
                src={user.profile_image_url}
                alt="Profile"
                className="h-16 w-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <a
            href="/settings/profile"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </a>
        </div>
      </div>

      {/* Show banner if subscription is scheduled to be paused or canceled */}
      {activeSubscription?.scheduled_change && (
        <SubscriptionScheduledBanner
          action={
            (activeSubscription.scheduled_change as ScheduledChange).action
          }
          effectiveDate={
            (activeSubscription.scheduled_change as ScheduledChange)
              .effective_at
          }
          subscriptionId={activeSubscription.paddle_subscription_id}
        />
      )}

      {/* Subscription Status Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Subscription Status</h2>
          {activeSubscription && (
            <div className="flex space-x-2">
              <SubscriptionActions
                status={activeSubscription.status.toLowerCase()}
                subscriptionId={activeSubscription.paddle_subscription_id}
                billingInterval={activeSubscription.billing_cycle_interval.toLowerCase()}
                scheduledChange={
                  activeSubscription.scheduled_change as ScheduledChange
                }
              />
            </div>
          )}
        </div>
        {activeSubscription ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(
                  activeSubscription.status
                )}`}
              >
                {getStatusText(activeSubscription.status)}
              </span>
            </div>
            <div className="border-t pt-4">
              <p className="text-gray-700 font-medium">
                Plan: {activeSubscription.product.name}
              </p>
              <p className="text-gray-700">
                Price:{" "}
                {formatPrice(
                  activeSubscription.price_amount,
                  activeSubscription.price_currency
                )}
                /{activeSubscription.billing_cycle_interval.toLowerCase()}
              </p>
              {activeSubscription.trial_ends_at && (
                <p className="text-gray-700">
                  Trial ends: {formatDate(activeSubscription.trial_ends_at)}
                </p>
              )}
              {activeSubscription.renews_at && (
                <p className="text-gray-700">
                  Next billing date: {formatDate(activeSubscription.renews_at)}
                </p>
              )}
              {activeSubscription.ends_at && (
                <p className="text-gray-700">
                  Subscription ends: {formatDate(activeSubscription.ends_at)}
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

      {/* Subscription History Section */}
      {historicalSubscriptions.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
          <div className="space-y-4">
            {historicalSubscriptions
              .sort(
                (a, b) =>
                  new Date(b.starts_at || "").getTime() -
                  new Date(a.starts_at || "").getTime()
              )
              .map((sub) => (
                <div key={sub.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{sub.product.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatPrice(sub.price_amount, sub.price_currency)}/
                        {sub.billing_cycle_interval.toLowerCase()}
                      </p>
                      {sub.starts_at && (
                        <p className="text-sm text-gray-600">
                          Started: {formatDate(sub.starts_at)}
                        </p>
                      )}
                      {sub.canceled_at && (
                        <p className="text-sm text-gray-600">
                          Canceled: {formatDate(sub.canceled_at)}
                        </p>
                      )}
                      {sub.ends_at && (
                        <p className="text-sm text-gray-600">
                          Ended: {formatDate(sub.ends_at)}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeColor(
                        sub.status
                      )}`}
                    >
                      {getStatusText(sub.status)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
