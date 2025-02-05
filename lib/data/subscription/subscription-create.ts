import { Subscription } from "@prisma/client";

import prisma from "@/lib/db";
import { isPaddleEvent, isPaddleSubscriptionEvent } from "@/lib/typeguards";

export const subscriptionCreate = async (data: any) => {
  if (!isPaddleEvent(data) || !isPaddleSubscriptionEvent(data)) {
    throw new Error("Invalid subscription event data");
  }

  const updateData: Omit<
    Subscription,
    "id" | "scheduled_change" | "canceled_at"
  > = {
    paddle_subscription_id: data.data.id,
    user_id: data.data?.custom_data?.user_id ?? "",
    price_id: data.data.items[0].price.id,
    product_id: data.data.items[0].product.id,
    status: data.data.status,
    price_amount: parseInt(data.data.items[0].price.unit_price.amount),
    price_currency: data.data.currency_code,
    collection_mode: data.data.collection_mode,
    billing_cycle_interval: data.data.billing_cycle.interval,
    billing_cycle_frequency: data.data.billing_cycle.frequency,
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
  };

  try {
    await prisma.subscription.upsert({
      where: {
        paddle_subscription_id: updateData.paddle_subscription_id,
      },
      update: updateData,
      create: updateData,
    });
  } catch (error) {
    console.error("Error creating subscription", error);
    throw new Error(
      `Failed to upsert Subscription #${updateData.paddle_subscription_id} to the database.`
    );
  }
};
