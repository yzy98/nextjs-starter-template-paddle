import { QUERIES } from "@/server/db/queries";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const pricesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await QUERIES.getPrices();
    return data;
  }),
});
