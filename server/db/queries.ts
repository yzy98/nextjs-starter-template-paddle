import prisma from "@/server/db";

export const QUERIES = {
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
  getPrices: function () {
    return prisma.price.findMany();
  },
};
