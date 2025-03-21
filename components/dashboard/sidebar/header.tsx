import Image from "next/image";
import Link from "next/link";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
