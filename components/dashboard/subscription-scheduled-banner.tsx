import { inferProcedureOutput } from "@trpc/server";
import { History } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    <Alert variant="destructive">
      <History className="size-4" />
      <AlertTitle>Scheduled {action}!</AlertTitle>
      <AlertDescription>
        <div className="flex items-center justify-between gap-4">
          <span>
            This subscription is scheduled to be {action}d on{" "}
            {formatDate(effectiveDate)}
          </span>
          <Button
            variant="destructive"
            onClick={handleCancelAction}
            disabled={isPending}
            size="sm"
            className="shrink-0 cursor-pointer"
          >
            {isPending ? "Processing..." : `Don't ${action}`}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
