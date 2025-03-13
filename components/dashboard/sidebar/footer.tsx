import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const DashboardSidebarFooter = () => {
  return (
    <SidebarFooter>
      <Suspense fallback={<DashboardSidebarFooterMenuSkeleton />}>
        <DashboardSidebarFooterMenu />
      </Suspense>
    </SidebarFooter>
  );
};

const DashboardSidebarFooterMenu = async () => {
  const user = await currentUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
              <Avatar className="size-4">
                <AvatarImage src={user?.imageUrl} />
                <AvatarFallback>
                  {user?.firstName?.charAt(0)}
                  {user?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="w-full flex items-center justify-between">
                {user?.fullName ||
                  user?.username ||
                  user?.emailAddresses[0].emailAddress}
                <ChevronUp />
              </span>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem>
              <Link href="/dashboard/account">
                <span>Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SignOutButton>
                <span>Sign out</span>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const DashboardSidebarFooterMenuSkeleton = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuSkeleton />
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
