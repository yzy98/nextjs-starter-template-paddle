import prisma from "@/lib/db";
import { isPaddleSubscriptionEvent, isPaddleEvent } from "@/lib/typeguards";
import { Prisma } from "@prisma/client";

export const subscriptionUpdate = async (data: any) => {
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
        renews_at: data.data.next_billed_at,
        ends_at: data.data?.current_billing_period?.ends_at ?? null,
        scheduled_change: data.data?.scheduled_change ?? Prisma.DbNull,
      },
    });
  } catch (error) {
    console.error("Error updating subscription", error);
    throw new Error(
      `Failed to update Subscription #${data.data.id} in the database.`
    );
  }
};
