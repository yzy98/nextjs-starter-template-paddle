"use server";

import { DB_QUERIES } from "@/server/db/queries";

type params = Promise<{ id: string }>;

export const getSubscription = async (params: params) => {
  const { id } = await params;
  return DB_QUERIES.getSubscriptionById(id);
};
