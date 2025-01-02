import { useState } from "react";
import { History } from "lucide-react";
import { getStatusText } from "./subscription-status-section";

import { formatDate, formatPrice } from "@/lib/utils";
import { Subscription, Price, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
interface SubscriptionWithDetails extends Subscription {
  product: Product;
  price: Price;
}

interface SubscriptionHistorySectionProps {
  subscriptions: SubscriptionWithDetails[];
}

const ITEMS_PER_PAGE = 5; // Show 5 items initially

export function SubscriptionHistorySection({
  subscriptions,
}: SubscriptionHistorySectionProps) {
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
                  {formatPrice(sub.price_amount, sub.price_currency)}/
                  {sub.billing_cycle_interval.toLowerCase()}
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
}
