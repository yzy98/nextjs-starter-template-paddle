import { inferProcedureOutput } from "@trpc/server";
import { CalendarDays } from "lucide-react";

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
interface SubscriptionsStatusScheduledAlertProps {
  activeSubscription: SubscriptionOutput;
}

export const SubscriptionsStatusScheduledAlert = ({
  activeSubscription,
}: SubscriptionsStatusScheduledAlertProps) => {
  const { manageSubscription, isPending } = useManageSubscription();

  if (!activeSubscription?.scheduledChange) return null;

  const action = (activeSubscription.scheduledChange as ScheduledChange).action;
  const effectiveDate = (activeSubscription.scheduledChange as ScheduledChange)
    .effective_at;

  const handleCancelAction = () => {
    manageSubscription({
      action: "scheduled_cancel",
      subscriptionId: activeSubscription.paddleSubscriptionId,
      effectiveFrom: "immediately",
    });
  };

  return (
    <Alert
      className="flex justify-between items-center gap-4"
      variant="destructive"
    >
      <div className="flex gap-2">
        <CalendarDays className="size-4 shrink-0" />
        <div>
          <AlertTitle>Scheduled {action}</AlertTitle>
          <AlertDescription>
            This subscription is scheduled to be {action}d on{" "}
            {formatDate(effectiveDate)}
          </AlertDescription>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={handleCancelAction}
        disabled={isPending}
        size="sm"
        className="shrink-0 cursor-pointer"
      >
        {isPending ? "Processing..." : `Don't ${action}`}
      </Button>
    </Alert>
  );
};
