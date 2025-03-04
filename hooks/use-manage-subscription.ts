import { useTRPC } from "@/trpc/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type EffectiveFrom = "immediately" | "next_billing_period";

export const useManageSubscription = () => {
  const { toast } = useToast();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { mutate: manageSubscription, isPending } = useMutation(
    trpc.subscriptions.manage.mutationOptions({
      onSuccess: async (_, variables) => {
        try {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: trpc.subscriptions.getActive.queryKey(),
            }),
            queryClient.invalidateQueries({
              queryKey: trpc.subscriptions.getInactive.queryKey(),
            }),
            queryClient.invalidateQueries({
              queryKey: trpc.subscriptions.countInactive.queryKey(),
            }),
          ]);

          toast({
            title: "Subscription updated",
            description: `Successfully ${variables.action}ed subscription`,
          });
        } catch (error) {
          throw new Error("Failed to invalidate queries");
        }
      },
      onError: (error, variables) => {
        toast({
          title: "Subscription not updated",
          description: `Failed to ${variables.action} subscription`,
        });
        console.error("Subscription action error:", error);
      },
    })
  );

  return {
    manageSubscription,
    isPending,
  };
};
