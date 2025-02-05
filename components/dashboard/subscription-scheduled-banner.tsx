"use client";

import { useState } from "react";

import { manageSubscription } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";


interface SubscriptionScheduledBannerProps {
  action: "pause" | "cancel";
  effectiveDate: string;
  subscriptionId: string;
}

export function SubscriptionScheduledBanner({
  action,
  effectiveDate,
  subscriptionId,
}: SubscriptionScheduledBannerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelAction = async () => {
    setIsLoading(true);
    try {
      // You'll need to implement this server action
      await manageSubscription(
        "scheduled_cancel",
        subscriptionId,
        "immediately"
      );
      toast({
        title: "Subscription updated",
        description: `Successfully canceled scheduled ${action}`,
      });
    } catch (error) {
      console.error("Error cancelling scheduled subscription:", error);
      toast({
        title: "Error",
        description: `Failed to cancel scheduled ${action}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-muted shadow-md rounded-lg p-3 md:p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Scheduled {action}</h3>
          <p className="text-sm text-muted-foreground">
            This subscription is scheduled to be {action}d on{" "}
            {formatDate(effectiveDate)}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleCancelAction}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Don't ${action}`}
      </Button>
    </div>
  );
}
