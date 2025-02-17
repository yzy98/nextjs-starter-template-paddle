import prisma from "@/server/db";
import { Prisma, Subscription } from "@prisma/client";

import {
  isPaddleEvent,
  isPaddleSubscriptionEvent,
} from "@/server/paddle/typeguards";

interface UpsertUserParams {
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  clerk_id: string;
}

export const DB_MUTATIONS = {
  /**
   * Create or update single record in DB User table
   */
  upsertUser: async function (upsertUserParams: UpsertUserParams) {
    try {
      await prisma.user.upsert({
        where: { clerk_id: upsertUserParams.clerk_id },
        update: { ...upsertUserParams },
        create: { ...upsertUserParams },
      });
    } catch (error: any) {
      console.error("Error creating or updating user:", error);
      throw new Error(error.message);
    }
  },
  /**
   * Delete single record in DB User table
   */
  deleteUser: async function ({ clerk_id }: { clerk_id: string }) {
    try {
      await prisma.user.delete({
        where: {
          clerk_id,
        },
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      throw new Error(error.message);
    }
  },
  /**
   * Create single record in DB Subscription table
   */
  createSubscription: async function (data: any) {
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
  },
  /**
   * Update single record in DB Subscription table
   */
  updateSubscription: async function (data: any) {
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
          starts_at: data.data.started_at
            ? new Date(data.data.started_at)
            : null,
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
  },
  /**
   * Cancel single record in DB Subscription table
   */
  cancelSubscription: async function (data: any) {
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
  },
};
