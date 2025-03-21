import { useState } from "react";

import { Loader2 } from "lucide-react";

import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const ChangePasswordButton = () => {
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [signOutDevices, setSignOutDevices] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = (
    <Button className="gap-2 cursor-pointer" variant="outline" size="sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M2.5 18.5v-1h19v1zm.535-5.973l-.762-.442l.965-1.693h-1.93v-.884h1.93l-.965-1.642l.762-.443L4 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L4 10.835zm8 0l-.762-.442l.966-1.693H9.308v-.884h1.93l-.965-1.642l.762-.443L12 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L12 10.835zm8 0l-.762-.442l.966-1.693h-1.931v-.884h1.93l-.965-1.642l.762-.443L20 9.066l.966-1.643l.761.443l-.965 1.642h1.93v.884h-1.93l.965 1.693l-.762.442L20 10.835z"
        ></path>
      </svg>
      <span className="text-sm text-muted-foreground">Change Password</span>
    </Button>
  );

  const editForm = (
    <div className={cn("grid gap-4", !isDesktop && "px-4")}>
      <Label htmlFor="current-password">Current Password</Label>
      <InputPassword
        id="current-password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="new-password"
        placeholder="Password"
      />
      <Label htmlFor="new-password">New Password</Label>
      <InputPassword
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
        placeholder="New Password"
      />
      <Label htmlFor="password">Confirm Password</Label>
      <InputPassword
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
        placeholder="Confirm Password"
      />
      <div className="flex gap-2 items-center">
        <Checkbox
          onCheckedChange={(checked) =>
            checked ? setSignOutDevices(true) : setSignOutDevices(false)
          }
        />
        <p className="text-sm">Sign out from other devices</p>
      </div>
    </div>
  );

  const UpdateButton = () => {
    return (
      <Button
        onClick={async () => {
          if (newPassword !== confirmPassword) {
            toast({
              title: "Error",
              variant: "destructive",
              description: "New Passwords do not match",
            });
            return;
          }
          if (newPassword.length < 8) {
            toast({
              title: "Error",
              variant: "destructive",
              description: "Password must be at least 8 characters",
            });
            return;
          }
          setLoading(true);
          const res = await authClient.changePassword({
            newPassword: newPassword,
            currentPassword: currentPassword,
            revokeOtherSessions: signOutDevices,
          });
          setLoading(false);
          if (res.error) {
            toast({
              title: "Error",
              variant: "destructive",
              description:
                res.error.message ||
                "Couldn't change your password! Make sure it's correct",
            });
          } else {
            setOpen(false);
            toast({
              title: "Success",
              description: "Password changed successfully",
            });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        }}
      >
        {loading ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          "Change Password"
        )}
      </Button>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Change your password</DialogDescription>
          </DialogHeader>
          {editForm}
          <DialogFooter>
            <UpdateButton />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Change Password</DrawerTitle>
          <DrawerDescription>Change your password</DrawerDescription>
        </DrawerHeader>
        {editForm}
        <DrawerFooter>
          <UpdateButton />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
