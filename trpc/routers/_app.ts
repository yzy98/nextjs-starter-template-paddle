import { createTRPCRouter } from "@/trpc/init";
import { pricesRouter } from "@/trpc/routers/prices";

export const appRouter = createTRPCRouter({
  prices: pricesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
