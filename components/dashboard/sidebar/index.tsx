import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";
import { DashboardSidebarHeader } from "./header";
import { DashboardSidebarFooter } from "./footer";
import { DashboardSidebarContent } from "./content";

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
