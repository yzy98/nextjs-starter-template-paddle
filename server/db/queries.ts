import prisma from "@/server/db";

export const DB_QUERIES = {
  /**
   * Get a user by his/her Clerk ID
   */
  getUserByClerkId: function (clerkId: string) {
    return prisma.user.findUnique({
      where: {
        clerk_id: clerkId,
      },
    });
  },
  /**
   * Fetch a price by interval
   */
  getPriceByInterval: function (
    subscriptionId: string,
    interval: "month" | "year"
  ) {
    return prisma.price.findFirst({
      where: {
        product: {
          subscriptions: {
            some: {
              paddle_subscription_id: subscriptionId,
            },
          },
        },
        billing_cycle_interval: interval,
      },
    });
  },
  getUserActiveSubscriptions: function (clerkId: string) {
    const activeStatuses = ["active", "trialing", "past_due", "paused"];

    return prisma.subscription.findMany({
      where: {
        user_id: clerkId,
        status: {
          in: activeStatuses,
        },
      },
      include: {
        price: true,
        product: true,
      },
    });
  },
  getUserInactiveSubscriptions: function (
    clerkId: string,
    limit: number,
    page: number
  ) {
    const activeStatuses = ["active", "trialing", "past_due", "paused"];
    const skip = (page - 1) * limit;

    return prisma.subscription.findMany({
      where: {
        user_id: clerkId,
        status: {
          notIn: activeStatuses,
        },
      },
      include: {
        price: true,
        product: true,
      },
      take: limit,
      skip: skip,
    });
  },
  getInactiveSubscriptionsCount: function (clerkId: string) {
    const activeStatuses = ["active", "trialing", "past_due", "paused"];

    return prisma.subscription.count({
      where: {
        user_id: clerkId,
        status: {
          notIn: activeStatuses,
        },
      },
    });
  },
};
