"use server";

import { auth } from "@/auth/server";
import { headers } from "next/headers";

export const getProfileSessions = async () => {
  const headersList = await headers();

  return Promise.all([
    auth.api.getSession({
      headers: headersList,
    }),
    auth.api.listSessions({
      headers: headersList,
    }),
  ]);
};
