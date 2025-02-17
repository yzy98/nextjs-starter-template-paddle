"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  EffectiveFrom,
  useManageSubscription,
} from "@/hooks/use-manage-subscription";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export type SubscriptionAction = "cancel" | "upgrade" | "downgrade" | null;

interface SubscriptionManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: SubscriptionAction;
  subscriptionId: string;
}

const actionConfig = {
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
  const { manageSubscription, isPending } = useManageSubscription();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [effectiveFrom, setEffectiveFrom] = useState<EffectiveFrom>(
    "next_billing_period"
  );

  if (!action) return null;

  const config = actionConfig[action];

  const handleAction = () => {
    manageSubscription(
      {
        action,
        subscriptionId,
        effectiveFrom,
      },
      {
        onSuccess: onClose,
      }
    );
  };

  const effectiveFromOptions = config.showEffectiveFrom ? (
    <div className={cn("space-y-4", !isDesktop && "px-4")}>
      <RadioGroup
        value={effectiveFrom}
        onValueChange={(value) => setEffectiveFrom(value as EffectiveFrom)}
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
              Changes will take effect at the start of your next billing cycle.
              You&apos;ll maintain access until then.
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
              Changes will take effect immediately. Any unused time will be
              forfeited.
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ) : null;

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          {effectiveFromOptions}
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              variant="outline"
              className={config.confirmClass}
              onClick={handleAction}
              disabled={isPending}
            >
              {isPending ? (
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

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{config.title}</DrawerTitle>
          <DrawerDescription>{config.description}</DrawerDescription>
        </DrawerHeader>
        {effectiveFromOptions}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DrawerClose>
          <Button
            variant="outline"
            className={config.confirmClass}
            onClick={handleAction}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Processing...
              </>
            ) : (
              config.confirmText
            )}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
