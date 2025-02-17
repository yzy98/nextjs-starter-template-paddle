import { createTRPCRouter } from "@/trpc/init";
import { subscriptionsRouter } from "./subscriptions";

export const appRouter = createTRPCRouter({
  subscriptions: subscriptionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
