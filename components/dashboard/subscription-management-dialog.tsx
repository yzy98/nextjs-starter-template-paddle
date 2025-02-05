"use client";

import { useState } from "react";

import {
  manageSubscription,
  type EffectiveFrom,
} from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionAction =
  | "pause"
  | "resume"
  | "cancel"
  | "upgrade"
  | "downgrade"
  | null;

interface SubscriptionManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: SubscriptionAction;
  subscriptionId: string;
}

const actionConfig = {
  pause: {
    title: "Pause Subscription",
    description: "When would you like your subscription to be paused?",
    confirmText: "Pause subscription",
    confirmClass:
      "text-yellow-700 border-yellow-500 hover:bg-yellow-50 dark:text-yellow-400 dark:border-yellow-400 dark:hover:bg-yellow-950",
    showEffectiveFrom: true,
  },
  resume: {
    title: "Resume Subscription",
    description: "Would you like to resume your subscription?",
    confirmText: "Resume subscription",
    confirmClass:
      "text-green-700 border-green-500 hover:bg-green-50 dark:text-green-400 dark:border-green-400 dark:hover:bg-green-950",
    showEffectiveFrom: false,
  },
  cancel: {
    title: "Cancel Subscription",
    description: "When would you like your subscription to be canceled?",
    confirmText: "Cancel subscription",
    confirmClass:
      "text-red-700 border-red-500 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-950",
    showEffectiveFrom: true,
  },
  upgrade: {
    title: "Upgrade to Annual Plan",
    description:
      "Would you like to upgrade to our annual plan? You'll save 16% compared to monthly billing.",
    confirmText: "Upgrade to annually",
    confirmClass:
      "text-blue-700 border-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950",
    showEffectiveFrom: false,
  },
  downgrade: {
    title: "Downgrade to Month Plan",
    description:
      "Are you sure you want to switch to month billing? You'll lose the annual discount.",
    confirmText: "Downgrade to monthly",
    confirmClass:
      "text-orange-700 border-orange-500 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-950",
    showEffectiveFrom: false,
  },
} as const;

export function SubscriptionManagementDialog({
  isOpen,
  onClose,
  action,
  subscriptionId,
}: SubscriptionManagementDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [effectiveFrom, setEffectiveFrom] = useState<EffectiveFrom>(
    "next_billing_period"
  );

  if (!action) return null;

  const config = actionConfig[action];

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await manageSubscription(action, subscriptionId, effectiveFrom);
      toast({
        title: "Subscription updated",
        description: `Successfully ${action}ed subscription`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Subscription not updated",
        description: `Failed to ${action} subscription`,
      });
      console.error("Subscription action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        {config.showEffectiveFrom && (
          <div className="space-y-4">
            <RadioGroup
              value={effectiveFrom}
              onValueChange={(value) =>
                setEffectiveFrom(value as EffectiveFrom)
              }
              className="gap-4"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="next_billing_period"
                  id="next_billing_period"
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="next_billing_period" className="font-medium">
                    At next billing period
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Changes will take effect at the start of your next billing
                    cycle. You&apos;ll maintain access until then.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="immediately" id="immediately" />
                <div className="grid gap-1.5">
                  <Label htmlFor="immediately" className="font-medium">
                    Immediately
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Changes will take effect immediately. Any unused time will
                    be forfeited.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className={config.confirmClass}
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Processing...
              </>
            ) : (
              config.confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
