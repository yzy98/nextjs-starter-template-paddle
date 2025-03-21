import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";

import { DashboardSidebarContent } from "./content";
import { DashboardSidebarFooter } from "./footer";
import { DashboardSidebarHeader } from "./header";

export function DashboardSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarSeparator />
      <DashboardSidebarContent />
      <DashboardSidebarFooter />
    </Sidebar>
  );
}
