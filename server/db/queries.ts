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
  getUserSubscriptions: function (
    clerkId: string,
    status: "active" | "inactive"
  ) {
    const activeStatuses = ["active", "trialing", "past_due", "paused"];
    const statusCondition =
      status === "active" ? { in: activeStatuses } : { notIn: activeStatuses };

    return prisma.subscription.findMany({
      where: {
        user_id: clerkId,
        status: statusCondition,
      },
      include: {
        price: true,
        product: true,
      },
    });
  },
};
