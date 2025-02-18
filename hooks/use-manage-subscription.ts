import { trpc } from "@/trpc/client";
import { useToast } from "@/hooks/use-toast";

export type EffectiveFrom = "immediately" | "next_billing_period";

export const useManageSubscription = () => {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { mutate: manageSubscription, isPending } =
    trpc.subscriptions.manage.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the active and inactive subscriptions queries
        utils.subscriptions.getActive.invalidate();
        utils.subscriptions.getInactive.invalidate();
        utils.subscriptions.countInactive.invalidate();

        toast({
          title: "Subscription updated",
          description: `Successfully ${variables.action}ed subscription`,
        });
      },
      onError: (error, variables) => {
        toast({
          title: "Subscription not updated",
          description: `Failed to ${variables.action} subscription`,
        });
        console.error("Subscription action error:", error);
      },
    });

  return {
    manageSubscription,
    isPending,
  };
};
