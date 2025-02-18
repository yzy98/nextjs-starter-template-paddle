import { useUser, useClerk } from "@clerk/nextjs";
import { type inferProcedureOutput } from "@trpc/server";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { type AppRouter } from "@/trpc/routers/_app";
import { Card, CardContent } from "@/components/ui/card";

type SubscriptionOutput = inferProcedureOutput<
  AppRouter["subscriptions"]["getActive"]
>;

interface UserProfileSectionProps {
  activeSubscription: SubscriptionOutput;
}

export const UserProfileSection = ({
  activeSubscription,
}: UserProfileSectionProps) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  const accountType =
    activeSubscription?.product?.name?.toLowerCase() || "free";

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.imageUrl} alt="Profile" />
              <AvatarFallback>
                {user.firstName?.[0] || user.lastName?.[0] || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                {user.firstName && user.lastName && (
                  <h2 className="text-xl font-semibold text-foreground mr-2">
                    {user.firstName} {user.lastName}
                  </h2>
                )}
                <Badge
                  variant={accountType === "premium" ? "premium" : "secondary"}
                >
                  {accountType.toUpperCase()}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center justify-start gap-2 p-2 cursor-pointer"
                onClick={() => openUserProfile()}
              >
                <Settings className="size-4" />
                Manage Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-700 flex items-center justify-start gap-2 p-2 cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export const UserProfileSectionSkeleton = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-9 w-9" />
        </div>
      </CardContent>
    </Card>
  );
};
