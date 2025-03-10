import { db } from "@/server/db";

import {
  isPaddleEvent,
  isPaddleSubscriptionEvent,
} from "@/server/paddle/typeguards";
import { prices, products, subscriptions, users } from "./schema";
import { eq } from "drizzle-orm";

type InsertProduct = typeof products.$inferInsert;
type InsertPrice = typeof prices.$inferInsert;
type InsertUser = typeof users.$inferInsert;
type InsertSubscription = typeof subscriptions.$inferInsert;

export const DB_MUTATIONS = {
  /**
   * Create or update single record in DB Product table
   */
  upsertProduct: async function (upsertProduct: InsertProduct) {
    try {
      const result = await db
        .insert(products)
        .values({ ...upsertProduct })
        .onConflictDoUpdate({
          target: products.paddleProductId,
          set: { ...upsertProduct },
        })
        .returning();

      return result[0];
    } catch (error: any) {
      console.error("Error upserting product:", error);
      throw new Error(error.message);
    }
  },
  /**
   * Create or update single record in DB Price table
   */
  upsertPrice: async function (upsertPrice: InsertPrice) {
    try {
      const result = await db
        .insert(prices)
        .values({ ...upsertPrice })
        .onConflictDoUpdate({
          target: prices.paddlePriceId,
          set: { ...upsertPrice },
        })
        .returning();

      return result[0];
    } catch (error: any) {
      console.error("Error upserting price:", error);
      throw new Error(error.message);
    }
  },
  /**
   * Create or update single record in DB User table
   */
  upsertUser: async function (upsertUser: InsertUser) {
    try {
      await db
        .insert(users)
        .values({ ...upsertUser })
        .onConflictDoUpdate({
          target: users.clerkId,
          set: { ...upsertUser },
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
      await db.delete(users).where(eq(users.clerkId, clerk_id));
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

    const updateData: InsertSubscription = {
      paddleSubscriptionId: data.data.id,
      userId: data.data?.custom_data?.user_id ?? "",
      priceId: data.data.items[0].price.id,
      productId: data.data.items[0].product.id,
      status: data.data.status,
      priceAmount: parseInt(data.data.items[0].price.unit_price.amount),
      priceCurrency: data.data.currency_code,
      collectionMode: data.data.collection_mode,
      billingCycleInterval: data.data.billing_cycle.interval,
      billingCycleFrequency: data.data.billing_cycle.frequency,
      startsAt: data.data.started_at ? new Date(data.data.started_at) : null,
      renewsAt: data.data.next_billed_at
        ? new Date(data.data.next_billed_at)
        : null,
      endsAt: data.data?.current_billing_period?.ends_at
        ? new Date(data.data.current_billing_period.ends_at)
        : null,
      trialStartsAt: data.data.items[0].trial_dates?.starts_at
        ? new Date(data.data.items[0].trial_dates.starts_at)
        : null,
      trialEndsAt: data.data.items[0].trial_dates?.ends_at
        ? new Date(data.data.items[0].trial_dates.ends_at)
        : null,
    };

    try {
      await db.insert(subscriptions).values(updateData);
    } catch (error) {
      console.error("Error creating subscription", error);
      throw new Error(
        `Failed to upsert Subscription #${updateData.paddleSubscriptionId} to the database.`
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
      await db
        .update(subscriptions)
        .set({
          priceId: data.data.items[0].price.id,
          productId: data.data.items[0].product.id,
          priceAmount: parseInt(data.data.items[0].price.unit_price.amount),
          priceCurrency: data.data.currency_code,
          collectionMode: data.data.collection_mode,
          billingCycleInterval: data.data.billing_cycle.interval,
          billingCycleFrequency: data.data.billing_cycle.frequency,
          status: data.data.status,
          startsAt: data.data.started_at
            ? new Date(data.data.started_at)
            : null,
          renewsAt: data.data.next_billed_at
            ? new Date(data.data.next_billed_at)
            : null,
          endsAt: data.data?.current_billing_period?.ends_at
            ? new Date(data.data.current_billing_period.ends_at)
            : null,
          trialStartsAt: data.data.items[0].trial_dates?.starts_at
            ? new Date(data.data.items[0].trial_dates.starts_at)
            : null,
          trialEndsAt: data.data.items[0].trial_dates?.ends_at
            ? new Date(data.data.items[0].trial_dates.ends_at)
            : null,
          scheduledChange: data.data?.scheduled_change ?? null,
        })
        .where(eq(subscriptions.paddleSubscriptionId, data.data.id));
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
      await db
        .update(subscriptions)
        .set({
          status: data.data.status,
          renewsAt: data.data.next_billed_at
            ? new Date(data.data.next_billed_at)
            : null,
          endsAt: data.data?.current_billing_period?.ends_at
            ? new Date(data.data.current_billing_period.ends_at)
            : null,
          canceledAt: data.data.canceled_at
            ? new Date(data.data.canceled_at)
            : null,
          scheduledChange: data.data?.scheduled_change ?? null,
        })
        .where(eq(subscriptions.paddleSubscriptionId, data.data.id));
    } catch (error) {
      console.error("Error cancelling subscription", error);
      throw new Error(
        `Failed to cancel Subscription #${data.data.id} in the database.`
      );
    }
  },
};
