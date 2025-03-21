"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";

import { signOut } from "@/auth/client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Signed out",
          });
          router.refresh();
          router.push("/");
        },
      },
    });
  };

  return (
    <DropdownMenuItem asChild>
      <button
        className="flex w-full items-center gap-2"
        onClick={handleSignOut}
      >
        <LogOut className="size-4 mr-2" />
        <span>Log out</span>
      </button>
    </DropdownMenuItem>
  );
};
