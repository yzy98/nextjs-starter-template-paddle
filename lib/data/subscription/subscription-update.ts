import { Prisma } from "@prisma/client";

import prisma from "@/lib/db";
import { isPaddleSubscriptionEvent, isPaddleEvent } from "@/lib/typeguards";

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
        price_id: data.data.items[0].price.id,
        product_id: data.data.items[0].product.id,
        price_amount: parseInt(data.data.items[0].price.unit_price.amount),
        price_currency: data.data.currency_code,
        collection_mode: data.data.collection_mode,
        billing_cycle_interval: data.data.billing_cycle.interval,
        billing_cycle_frequency: data.data.billing_cycle.frequency,
        status: data.data.status,
        starts_at: data.data.started_at ? new Date(data.data.started_at) : null,
        renews_at: data.data.next_billed_at
          ? new Date(data.data.next_billed_at)
          : null,
        ends_at: data.data?.current_billing_period?.ends_at
          ? new Date(data.data.current_billing_period.ends_at)
          : null,
        trial_starts_at: data.data.items[0].trial_dates?.starts_at
          ? new Date(data.data.items[0].trial_dates.starts_at)
          : null,
        trial_ends_at: data.data.items[0].trial_dates?.ends_at
          ? new Date(data.data.items[0].trial_dates.ends_at)
          : null,
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
