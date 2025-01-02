import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, MoreHorizontal, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileSectionProps {
  accountType?: string;
}

export function UserProfileSection({
  accountType = "free",
}: UserProfileSectionProps) {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
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
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                  accountType.toLowerCase() === "premium"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white dark:from-blue-400 dark:to-purple-400 shadow-sm"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {accountType.toUpperCase()}
              </span>
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
    </div>
  );
}
