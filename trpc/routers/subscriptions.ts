import { DB_QUERIES } from "@/server/db/queries";
import { PADDLE_MUTATIONS } from "@/server/paddle/mutations";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";

export const subscriptionsRouter = createTRPCRouter({
  getActive: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    try {
      const data = await DB_QUERIES.getUserActiveSubscriptions(userId);
      return data[0] || null;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch active subscription",
        cause: error,
      });
    }
  }),
  getInactive: protectedProcedure
    .input(
      z.object({
        limit: z
          .number()
          .min(1)
          .max(100)
          .default(SUBSCRIPTION_HISTORY_PAGE_SIZE),
        page: z.number().min(0).default(0),
        sortingId: z
          .enum([
            "productName",
            "billingCycleInterval",
            "priceAmount",
            "startsAt",
            "endsAt",
            "status",
          ])
          .optional(),
        sortingDirection: z.enum(["asc", "desc"]).optional(),
        globalFilter: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { limit, page, sortingId, sortingDirection, globalFilter } = input;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        const data = await DB_QUERIES.getUserInactiveSubscriptions({
          userId,
          limit,
          page,
          sortingId,
          sortingDirection,
          globalFilter,
        });

        return data;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch inactive subscriptions",
          cause: error,
        });
      }
    }),
  countInactive: protectedProcedure
    .input(z.object({ globalFilter: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const { globalFilter } = input;

      try {
        const data = await DB_QUERIES.getInactiveSubscriptionsCount({
          userId,
          globalFilter,
        });
        return data;
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
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
      const { userId } = ctx;

      if (!userId) {
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
          const monthlyPrices = await DB_QUERIES.getPriceByInterval(
            subscriptionId,
            "month"
          );

          if (!monthlyPrices || monthlyPrices.length === 0) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          const monthlyPrice = monthlyPrices[0];

          subscriptionResponse = await PADDLE_MUTATIONS.updateSubscription(
            subscriptionId,
            {
              prorationBillingMode: "prorated_immediately",
              onPaymentFailure: "prevent_change",
              items: [
                {
                  priceId: monthlyPrice.price.paddlePriceId,
                  quantity: 1,
                },
              ],
            }
          );
          break;
        case "upgrade":
          const yearlyPrices = await DB_QUERIES.getPriceByInterval(
            subscriptionId,
            "year"
          );

          if (!yearlyPrices || yearlyPrices.length === 0) {
            throw new TRPCError({ code: "BAD_REQUEST" });
          }

          const yearlyPrice = yearlyPrices[0];

          subscriptionResponse = await PADDLE_MUTATIONS.updateSubscription(
            subscriptionId,
            {
              prorationBillingMode: "prorated_immediately",
              onPaymentFailure: "prevent_change",
              items: [
                {
                  priceId: yearlyPrice.price.paddlePriceId,
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
