import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type SubscriptionsGetInactiveOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getInactive"]
>;

export type SubscriptionsGetInactiveOutputSingle =
  SubscriptionsGetInactiveOutput[0];

export type SubscriptionsCountInactiveOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["countInactive"]
>;

export type SubscriptionsGetActiveOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getActive"]
>;
