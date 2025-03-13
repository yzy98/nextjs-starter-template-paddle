import { cookies } from "next/headers";

import { SUBSCRIPTION_HISTORY_PAGE_SIZE } from "@/lib/constants";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardBreadcrumb } from "@/components/dashboard/breadcrumb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sidebar state cookie
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  // Prefetch all Dashboard-required data
  prefetch(trpc.subscriptions.getActive.queryOptions());
  prefetch(
    trpc.subscriptions.getInactive.queryOptions({
      limit: SUBSCRIPTION_HISTORY_PAGE_SIZE,
      page: 0,
    })
  );
  prefetch(trpc.subscriptions.countInactive.queryOptions({}));

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <HydrateClient>
        <DashboardSidebar />
        <SidebarInset>
          <main className="flex items-start justify-center w-full h-full px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <div className="flex-col space-y-5 flex-1 max-w-5xl">
              <SidebarTrigger />
              <DashboardBreadcrumb />
              {children}
            </div>
          </main>
        </SidebarInset>
      </HydrateClient>
    </SidebarProvider>
  );
}
