"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pause, Play, XCircle, CreditCard } from "lucide-react";
import {
  SubscriptionManagementDialog,
  type SubscriptionAction,
} from "@/components/dashboard/subscription-management-dialog";

interface SubscriptionActionsProps {
  status: string;
  subscriptionId: string;
  scheduledChange?: {
    action: "pause" | "cancel";
    effective_at: string;
    resume_at: string | null;
  } | null;
}

export function SubscriptionActions({
  status,
  subscriptionId,
  scheduledChange,
}: SubscriptionActionsProps) {
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
          <Button
            variant="outline"
            size="icon"
            disabled={!!scheduledChange}
            title={
              scheduledChange
                ? scheduledChange.action === "cancel"
                  ? "Cancellation scheduled"
                  : `Pause scheduled for ${new Date(
                      scheduledChange.effective_at
                    ).toLocaleDateString()}`
                : undefined
            }
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* {status === "past_due" && (
            <DropdownMenuItem asChild>
              <a
                href={`/subscription/update-payment/${subscriptionId}`}
                className="flex items-center justify-center gap-2 p-2"
              >
                <CreditCard className="h-4 w-4" />
                Update Payment
              </a>
            </DropdownMenuItem>
          )} */}
          {status === "active" && !scheduledChange && (
            <>
              {/* <DropdownMenuItem
                className="text-yellow-700 flex items-center justify-center gap-2 p-2 cursor-pointer"
                onClick={() =>
                  setDialogState({ isOpen: true, action: "pause" })
                }
              >
                <Pause className="h-4 w-4" />
                Pause
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="text-red-700 flex items-center justify-center gap-2 p-2 cursor-pointer"
                onClick={() =>
                  setDialogState({ isOpen: true, action: "cancel" })
                }
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </DropdownMenuItem>
            </>
          )}
          {status === "paused" && !scheduledChange && (
            <DropdownMenuItem
              className="text-green-700 flex items-center justify-center gap-2 p-2 cursor-pointer"
              onClick={() => setDialogState({ isOpen: true, action: "resume" })}
            >
              <Play className="h-4 w-4" />
              Resume
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <SubscriptionManagementDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, action: null })}
        action={dialogState.action}
        subscriptionId={subscriptionId}
      />
    </>
  );
}
