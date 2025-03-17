import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";

export const DashboardSidebarHeader = () => {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};
