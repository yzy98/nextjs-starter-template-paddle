"use client";

import { useState } from "react";

import { MoreHorizontal, ArrowUp, ArrowDown, X } from "lucide-react";

import {
  SubscriptionsStatusManagementDialog,
  type SubscriptionAction,
} from "@/components/dashboard/subscriptions/status/management-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubscriptionsStatusActionsProps {
  status: string;
  subscriptionId: string;
  billingInterval: string;
  scheduledChange?: {
    action: "pause" | "cancel";
    effective_at: string;
    resume_at: string | null;
  } | null;
}

export function SubscriptionsStatusActions({
  status,
  subscriptionId,
  billingInterval,
  scheduledChange,
}: SubscriptionsStatusActionsProps) {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: SubscriptionAction;
  }>({
    isOpen: false,
    action: null,
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={!!scheduledChange}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === "active" && !scheduledChange && (
            <>
              {billingInterval === "month" && (
                <DropdownMenuItem
                  className="text-blue-700 flex items-center justify-start gap-2 p-2 cursor-pointer"
                  onClick={() =>
                    setDialogState({ isOpen: true, action: "upgrade" })
                  }
                >
                  <ArrowUp className="size-4" />
                  Upgrade to Annually
                </DropdownMenuItem>
              )}
              {billingInterval === "year" && (
                <DropdownMenuItem
                  className="text-orange-700 flex items-center justify-start gap-2 p-2 cursor-pointer"
                  onClick={() =>
                    setDialogState({ isOpen: true, action: "downgrade" })
                  }
                >
                  <ArrowDown className="size-4" />
                  Downgrade to Monthly
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-700 flex items-center justify-start gap-2 p-2 cursor-pointer"
                onClick={() =>
                  setDialogState({ isOpen: true, action: "cancel" })
                }
              >
                <X className="size-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SubscriptionsStatusManagementDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, action: null })}
        action={dialogState.action}
        subscriptionId={subscriptionId}
      />
    </>
  );
}
