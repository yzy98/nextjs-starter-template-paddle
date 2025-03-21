"use server";

import { headers } from "next/headers";

import { auth } from "@/auth/server";

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
