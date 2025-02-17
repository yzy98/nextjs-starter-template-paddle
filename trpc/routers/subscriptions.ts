import { DB_QUERIES } from "@/server/db/queries";
import { PADDLE_MUTATIONS } from "@/server/paddle/mutations";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const subscriptionsRouter = createTRPCRouter({
  getActive: protectedProcedure.query(async ({ ctx }) => {
    const { clerkUserId } = ctx;

    if (!clerkUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const data = await DB_QUERIES.getUserSubscriptions(clerkUserId, "active");
      return data[0] || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch active subscription",
        cause: error,
      });
    }
  }),
  getInactive: protectedProcedure.query(async ({ ctx }) => {
    const { clerkUserId } = ctx;

    if (!clerkUserId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const data = await DB_QUERIES.getUserSubscriptions(
        clerkUserId,
        "inactive"
      );
      return data;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch inactive subscriptions",
        cause: error,
      });
    }
  }),
  manage: protectedProcedure
    .input(
      z.object({
        action: z.enum(["cancel", "scheduled_cancel", "downgrade", "upgrade"]),
        subscriptionId: z.string(),
        effectiveFrom: z.enum(["immediately", "next_billing_period"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { clerkUserId } = ctx;

      if (!clerkUserId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { action, subscriptionId, effectiveFrom } = input;
      let subscriptionResponse;

      switch (action) {
        case "cancel":
          subscriptionResponse = await PADDLE_MUTATIONS.cancelSubscription(
            subscriptionId,
            {
              effectiveFrom,
            }
          );
          break;
        case "scheduled_cancel":
          subscriptionResponse = await PADDLE_MUTATIONS.updateSubscription(
            subscriptionId,
            {
              scheduledChange: null,
            }
          );
          break;
        case "downgrade":
          const monthlyPrice = await DB_QUERIES.getPriceByInterval(
            subscriptionId,
            "month"
          );

          if (!monthlyPrice) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          subscriptionResponse = await PADDLE_MUTATIONS.updateSubscription(
            subscriptionId,
            {
              prorationBillingMode: "prorated_immediately",
              onPaymentFailure: "prevent_change",
              items: [
                {
                  priceId: monthlyPrice.paddle_price_id,
                  quantity: 1,
                },
              ],
            }
          );
          break;
        case "upgrade":
          const yearlyPrice = await DB_QUERIES.getPriceByInterval(
            subscriptionId,
            "year"
          );

          if (!yearlyPrice) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          subscriptionResponse = await PADDLE_MUTATIONS.updateSubscription(
            subscriptionId,
            {
              prorationBillingMode: "prorated_immediately",
              onPaymentFailure: "prevent_change",
              items: [
                {
                  priceId: yearlyPrice.paddle_price_id,
                  quantity: 1,
                },
              ],
            }
          );
          break;
        default:
          throw new TRPCError({ code: "BAD_REQUEST" });
      }

      return subscriptionResponse;
    }),
});
