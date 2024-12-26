"use server";

import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { auth } from "@clerk/nextjs/server";

export type EffectiveFrom = "immediately" | "next_billing_period";

export async function manageSubscription(
  action: "pause" | "resume" | "cancel" | "scheduled_cancel",
  subscriptionId: string,
  effectiveFrom: EffectiveFrom
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const paddle = getPaddleInstance();

    switch (action) {
      case "pause":
        await paddle.subscriptions.pause(subscriptionId, {
          effectiveFrom,
        });
        break;
      case "scheduled_cancel":
        await paddle.subscriptions.update(subscriptionId, {
          scheduledChange: null,
        });
        break;
      case "cancel":
        await paddle.subscriptions.cancel(subscriptionId, {
          effectiveFrom,
        });
        break;
      case "resume":
        await paddle.subscriptions.resume(subscriptionId, {
          effectiveFrom: "immediately",
        });
        break;
      default:
        throw new Error("Invalid action");
    }

    return { success: true };
  } catch (error) {
    console.error("Subscription action error:", error);
    throw error;
  }
}
