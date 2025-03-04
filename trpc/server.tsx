import "server-only"; // <-- ensure this file cannot be imported from the client

import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
import React, { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
import { createTRPCClient, httpLink } from "@trpc/client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

export const HydrateClient = (props: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
};

export const prefetch = <T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) => {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
};

export const caller = appRouter.createCaller(createTRPCContext);

// If your router is on a separate server, pass a client:
createTRPCOptionsProxy({
  client: createTRPCClient({
    links: [httpLink({ url: "..." })],
  }),
  queryClient: getQueryClient,
});
