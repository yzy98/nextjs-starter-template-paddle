import { Prisma } from "@prisma/client";

import prisma from "@/lib/db";
import { isPaddleSubscriptionEvent, isPaddleEvent } from "@/lib/typeguards";

export const subscriptionCancel = async (data: any) => {
  if (!isPaddleEvent(data) || !isPaddleSubscriptionEvent(data)) {
    throw new Error("Invalid subscription event data");
  }

  try {
    await prisma.subscription.update({
      where: {
        paddle_subscription_id: data.data.id,
      },
      data: {
        status: data.data.status,
        renews_at: data.data.next_billed_at
          ? new Date(data.data.next_billed_at)
          : null,
        ends_at: data.data?.current_billing_period?.ends_at
          ? new Date(data.data.current_billing_period.ends_at)
          : null,
        canceled_at: data.data.canceled_at
          ? new Date(data.data.canceled_at)
          : null,
        scheduled_change: data.data?.scheduled_change ?? Prisma.DbNull,
      },
    });
  } catch (error) {
    console.error("Error cancelling subscription", error);
    throw new Error(
      `Failed to cancel Subscription #${data.data.id} in the database.`
    );
  }
};
