"use client";

import { useState } from "react";

import { type inferProcedureOutput } from "@trpc/server";
import { History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import { getStatusText } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

interface SubscriptionHistorySectionProps {
  subscriptions: SubscriptionOutput;
}

export const SubscriptionHistorySection = ({
  subscriptions,
}: SubscriptionHistorySectionProps) => {
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  if (subscriptions.length === 0) return null;

  const sortedSubscriptions = subscriptions.sort(
    (a, b) =>
      new Date(b.starts_at || "").getTime() -
      new Date(a.starts_at || "").getTime()
  );

  const displayedSubscriptions = sortedSubscriptions.slice(0, displayCount);
  const hasMore = displayCount < subscriptions.length;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Subscription History
      </h2>
      <div className="space-y-4">
        {displayedSubscriptions.map((sub) => (
          <div
            key={sub.id}
            className="border-b border-border pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-foreground">
                  {sub.product.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(sub.price_amount.toString(), sub.price_currency)}
                  /{sub.billing_cycle_interval.toLowerCase()}
                </p>
                {sub.starts_at && (
                  <p className="text-sm text-muted-foreground">
                    Started: {formatDate(sub.starts_at)}
                  </p>
                )}
                {sub.canceled_at && (
                  <p className="text-sm text-muted-foreground">
                    Canceled: {formatDate(sub.canceled_at)}
                  </p>
                )}
                {sub.ends_at && (
                  <p className="text-sm text-muted-foreground">
                    Ended: {formatDate(sub.ends_at)}
                  </p>
                )}
              </div>
              <Badge variant="destructive">{getStatusText(sub.status)}</Badge>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <Button
          onClick={() => setDisplayCount((prev) => prev + ITEMS_PER_PAGE)}
          variant="outline"
          className="mt-4 w-full border border-border"
        >
          <History className="mr-2 h-4 w-4" />
          Load More History
        </Button>
      )}
    </div>
  );
};

export const SubscriptionHistorySectionSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 mt-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border-b border-border pb-4 last:border-b-0">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
