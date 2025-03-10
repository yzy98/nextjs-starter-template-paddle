import { ACTIVE_SUBSCRIPTION_STATUSES } from "@/lib/constants";
import { db } from "@/server/db";
import { InactiveSubscriptionsSortParams } from "@/stores/use-inactive-subscriptions-store";
import { and, asc, desc, eq, inArray, notInArray } from "drizzle-orm";
import { prices, products, subscriptions, users } from "./schema";

export const DB_QUERIES = {
  /**
   * Fetch all products
   */
  getProducts: function () {
    return db.select().from(products);
  },
  /**
   * Fetch all prices
   */
  getPrices: function () {
    return db.select().from(prices);
  },
  /**
   * Get a user by his/her Clerk ID
   */
  getUserByClerkId: function (clerkId: string) {
    return db.select().from(users).where(eq(users.clerkId, clerkId));
  },
  /**
   * Fetch a price by interval
   */
  getPriceByInterval: function (
    subscriptionId: string,
    interval: "month" | "year"
  ) {
    return db
      .select({
        price: prices,
        product: products,
      })
      .from(prices)
      .innerJoin(products, eq(prices.productId, products.paddleProductId))
      .innerJoin(
        subscriptions,
        eq(products.paddleProductId, subscriptions.productId)
      )
      .where(
        and(
          eq(subscriptions.paddleSubscriptionId, subscriptionId),
          eq(prices.billingCycleInterval, interval)
        )
      );
  },
  /**
   * Fetch a user's active subscriptions
   */
  getUserActiveSubscriptions: function (clerkId: string) {
    return db
      .select({
        id: subscriptions.id,
        paddleSubscriptionId: subscriptions.paddleSubscriptionId,
        status: subscriptions.status,
        priceAmount: subscriptions.priceAmount,
        priceCurrency: subscriptions.priceCurrency,
        billingCycleInterval: subscriptions.billingCycleInterval,
        renewsAt: subscriptions.renewsAt,
        endsAt: subscriptions.endsAt,
        trialEndsAt: subscriptions.trialEndsAt,
        scheduledChange: subscriptions.scheduledChange,
        productName: products.name,
      })
      .from(subscriptions)
      .innerJoin(
        products,
        eq(subscriptions.productId, products.paddleProductId)
      )
      .where(
        and(
          eq(subscriptions.userId, clerkId),
          inArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES)
        )
      );
  },
  /**
   * Fetch a user's inactive subscriptions
   */
  getUserInactiveSubscriptions: function (
    clerkId: string,
    limit: number,
    page: number,
    sortParams?: InactiveSubscriptionsSortParams
  ) {
    // Pagination
    const take = limit;
    const skip = (page - 1) * limit;

    let query = db
      .select({
        id: subscriptions.id,
        paddleSubscriptionId: subscriptions.paddleSubscriptionId,
        status: subscriptions.status,
        priceAmount: subscriptions.priceAmount,
        priceCurrency: subscriptions.priceCurrency,
        billingCycleInterval: subscriptions.billingCycleInterval,
        startsAt: subscriptions.startsAt,
        endsAt: subscriptions.endsAt,
        canceledAt: subscriptions.canceledAt,
        scheduledChange: subscriptions.scheduledChange,
        productName: products.name,
      })
      .from(subscriptions)
      .innerJoin(
        products,
        eq(subscriptions.productId, products.paddleProductId)
      )
      .where(
        and(
          eq(subscriptions.userId, clerkId),
          notInArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES)
        )
      )
      .limit(take)
      .offset(skip);

    // Add sorting if provided
    if (sortParams) {
      if (sortParams.field === "plan") {
        return query.orderBy(
          sortParams.direction === "asc"
            ? asc(products.name)
            : desc(products.name)
        );
      } else {
        const column = (() => {
          switch (sortParams.field) {
            case "status":
              return subscriptions.status;
            case "interval":
              return subscriptions.billingCycleInterval;
            case "price":
              return subscriptions.priceAmount;
            case "start":
              return subscriptions.startsAt;
            case "end":
              return subscriptions.endsAt;
            default:
              return subscriptions.id;
          }
        })();

        return query.orderBy(
          sortParams.direction === "asc" ? asc(column) : desc(column)
        );
      }
    }

    return query;
  },
  /**
   * Fetch the count of a user's inactive subscriptions
   */
  getInactiveSubscriptionsCount: function (clerkId: string) {
    return db.$count(
      subscriptions,
      and(
        eq(subscriptions.userId, clerkId),
        notInArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES)
      )
    );
  },
};
