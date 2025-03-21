"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DollarSign, Settings, User } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

export const DashboardSidebarContent = () => {
  // Menu items.
  const items = [
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "Subscriptions",
      url: "/dashboard/subscriptions",
      icon: DollarSign,
      subItems: [
        {
          title: "Status",
          url: "/dashboard/subscriptions/status",
        },
        {
          title: "History",
          url: "/dashboard/subscriptions/history",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const pathname = usePathname();

  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === item.url ||
                    (isCollapsed && pathname.includes(item.url))
                  }
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.subItems && (
                  <SidebarMenuSub>
                    {item.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === subItem.url}
                        >
                          <Link href={subItem.url}>{subItem.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};
