import { ACTIVE_SUBSCRIPTION_STATUSES } from "@/lib/constants";
import { db } from "@/server/db";
import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  notInArray,
  or,
  sql,
  count,
} from "drizzle-orm";
import { prices, products, subscriptions, users } from "./schema";
import { auth } from "@/auth/server";
import { headers } from "next/headers";

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
   * Get the current logged in user
   */
  getUser: async function () {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    const userId = session.user.id;
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  },
  /**
   * Get a user by userId
   */
  getUserById: function (userId: string) {
    return db.select().from(users).where(eq(users.id, userId));
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
  getUserActiveSubscriptions: function (userId: string) {
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
          eq(subscriptions.userId, userId),
          inArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES)
        )
      );
  },
  /**
   * Fetch a user's inactive subscriptions
   */
  getUserInactiveSubscriptions: function ({
    userId,
    limit,
    page,
    sortingId,
    sortingDirection,
    globalFilter,
  }: {
    userId: string;
    limit: number;
    page: number;
    sortingId?:
      | "productName"
      | "billingCycleInterval"
      | "priceAmount"
      | "startsAt"
      | "endsAt"
      | "status";
    sortingDirection?: "asc" | "desc";
    globalFilter?: string;
  }) {
    // Pagination
    const take = limit;
    const skip = page * limit;

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
          eq(subscriptions.userId, userId),
          notInArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES),
          ...(globalFilter && globalFilter.length > 0
            ? [
                or(
                  ilike(products.name, `%${globalFilter}%`),
                  ilike(subscriptions.status, `%${globalFilter}%`),
                  ilike(
                    subscriptions.billingCycleInterval,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.priceAmount} AS TEXT)`,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.startsAt} AS TEXT)`,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.endsAt} AS TEXT)`,
                    `%${globalFilter}%`
                  )
                ),
              ]
            : [])
        )
      )
      .limit(take)
      .offset(skip);

    // Add sorting if provided
    if (sortingId && sortingDirection) {
      if (sortingId === "productName") {
        return query.orderBy(
          sortingDirection === "asc" ? asc(products.name) : desc(products.name)
        );
      } else {
        const column = subscriptions[sortingId];
        return query.orderBy(
          sortingDirection === "asc" ? asc(column) : desc(column)
        );
      }
    }

    return query;
  },
  /**
   * Fetch the count of a user's inactive subscriptions
   */
  getInactiveSubscriptionsCount: async function ({
    userId,
    globalFilter,
  }: {
    userId: string;
    globalFilter?: string;
  }) {
    return db
      .select({ count: count() })
      .from(subscriptions)
      .innerJoin(
        products,
        eq(subscriptions.productId, products.paddleProductId)
      )
      .where(
        and(
          eq(subscriptions.userId, userId),
          notInArray(subscriptions.status, ACTIVE_SUBSCRIPTION_STATUSES),
          ...(globalFilter && globalFilter.length > 0
            ? [
                or(
                  ilike(products.name, `%${globalFilter}%`),
                  ilike(subscriptions.status, `%${globalFilter}%`),
                  ilike(
                    subscriptions.billingCycleInterval,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.priceAmount} AS TEXT)`,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.startsAt} AS TEXT)`,
                    `%${globalFilter}%`
                  ),
                  ilike(
                    sql`CAST(${subscriptions.endsAt} AS TEXT)`,
                    `%${globalFilter}%`
                  )
                ),
              ]
            : [])
        )
      )
      .then((result) => result[0]?.count || 0);
  },
};
