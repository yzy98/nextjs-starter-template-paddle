import { inferProcedureOutput } from "@trpc/server";

import { Button } from "@/components/ui/button";
import { useManageSubscription } from "@/hooks/use-manage-subscription";
import { formatDate } from "@/lib/utils";
import { AppRouter } from "@/trpc/routers/_app";

type ScheduledChange = {
  action: "pause" | "cancel";
  effective_at: string;
  resume_at: string | null;
};

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getActive"]
>;
interface SubscriptionScheduledBannerProps {
  activeSubscription: SubscriptionOutput;
}

export const SubscriptionScheduledBanner = ({
  activeSubscription,
}: SubscriptionScheduledBannerProps) => {
  const { manageSubscription, isPending } = useManageSubscription();

  if (!activeSubscription?.scheduled_change) return null;

  const action = (activeSubscription.scheduled_change as ScheduledChange)
    .action;
  const effectiveDate = (activeSubscription.scheduled_change as ScheduledChange)
    .effective_at;

  const handleCancelAction = () => {
    manageSubscription({
      action: "scheduled_cancel",
      subscriptionId: activeSubscription.paddle_subscription_id,
      effectiveFrom: "immediately",
    });
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
        disabled={isPending}
      >
        {isPending ? "Processing..." : `Don't ${action}`}
      </Button>
    </div>
  );
};
