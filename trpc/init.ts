import { auth } from "@/auth/server";
import { DB_QUERIES } from "@/server/db/queries";
import { ratelimit } from "@/server/redis/ratelimit";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

// Keep it as light as possible
export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    userId: session?.user.id,
  };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async (opts) => {
  // Check if the user is authenticated
  const { ctx } = opts;

  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  // Get the user from the database
  const users = await DB_QUERIES.getUserById(ctx.userId);

  if (!users || users.length === 0) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const user = users[0];

  // Check if the user is rate limited
  const { success } = await ratelimit.limit(user.id);

  if (!success) {
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
