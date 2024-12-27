"use server";

import prisma from "@/lib/db";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { auth } from "@clerk/nextjs/server";

export type EffectiveFrom = "immediately" | "next_billing_period";

export async function manageSubscription(
  action:
    | "pause"
    | "resume"
    | "cancel"
    | "scheduled_cancel"
    | "downgrade"
    | "upgrade",
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
      case "downgrade":
        const downgradedSubscription = await prisma.subscription.findUnique({
          where: { paddle_subscription_id: subscriptionId },
          include: {
            product: {
              include: {
                prices: true,
              },
            },
          },
        });

        if (!downgradedSubscription) {
          throw new Error("Subscription not found");
        }

        const monthlyPrice = downgradedSubscription.product.prices.find(
          (price) => price.billing_cycle_interval === "month"
        );

        if (!monthlyPrice) {
          throw new Error("Monthly price not found");
        }

        await paddle.subscriptions.update(subscriptionId, {
          prorationBillingMode: "prorated_immediately",
          onPaymentFailure: "prevent_change",
          items: [
            {
              priceId: monthlyPrice.paddle_price_id,
              quantity: 1,
            },
          ],
        });
        break;
      case "upgrade":
        const upgradedSubscription = await prisma.subscription.findUnique({
          where: { paddle_subscription_id: subscriptionId },
          include: {
            product: {
              include: {
                prices: true,
              },
            },
          },
        });

        if (!upgradedSubscription) {
          throw new Error("Subscription not found");
        }

        const yearlyPrice = upgradedSubscription.product.prices.find(
          (price) => price.billing_cycle_interval === "year"
        );

        if (!yearlyPrice) {
          throw new Error("Yearly price not found");
        }

        await paddle.subscriptions.update(subscriptionId, {
          prorationBillingMode: "prorated_immediately",
          onPaymentFailure: "prevent_change",
          items: [
            {
              priceId: yearlyPrice.paddle_price_id,
              quantity: 1,
            },
          ],
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
