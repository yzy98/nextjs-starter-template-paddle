import { useState } from "react";

import {
  Edit,
  Mail,
  MoreHorizontal,
  RectangleEllipsis,
  Trash,
} from "lucide-react";

import { useSession } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

import { ChangeEmailForm } from "./forms/change-email-form";
import { ChangePasswordForm } from "./forms/change-password-form";
import { DeleteUserForm } from "./forms/delete-user-form";
import { EditUserForm } from "./forms/edit-user-form";
import { ProfileActionsDialog } from "./profile-actions-dialog";

type ProfileAction =
  | "edit-user"
  | "change-password"
  | "change-email"
  | "delete-user"
  | null;

export const ProfileActions = () => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    action: ProfileAction;
  }>({
    isOpen: false,
    action: null,
  });

  const { data } = useSession();

  const actionConfig: Record<
    Exclude<ProfileAction, null>,
    {
      title: string;
      description: string;
      form: React.ReactNode;
    }
  > = {
    "edit-user": {
      title: "Edit User",
      description: "Edit user information",
      form: (
        <EditUserForm
          namePlaceholder={data?.user.name || "John Doe"}
          setOpen={() => setDialogState({ isOpen: false, action: null })}
        />
      ),
    },
    "change-password": {
      title: "Change Password",
      description: "Enter your current password and new password",
      form: (
        <ChangePasswordForm
          setOpen={() => setDialogState({ isOpen: false, action: null })}
        />
      ),
    },
    "change-email": {
      title: "Change Email",
      description: "Enter your new email address",
      form: (
        <ChangeEmailForm
          setOpen={() => setDialogState({ isOpen: false, action: null })}
        />
      ),
    },
    "delete-user": {
      title: "Delete User",
      description: "Enter your password to delete your account",
      form: (
        <DeleteUserForm
          setOpen={() => setDialogState({ isOpen: false, action: null })}
        />
      ),
    },
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="flex flex-col">
          <DropdownMenuItem
            className="flex items-center justify-start gap-2 p-2 cursor-pointer"
            onClick={() =>
              setDialogState({ isOpen: true, action: "edit-user" })
            }
          >
            <Edit />
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-start gap-2 p-2 cursor-pointer"
            onClick={() =>
              setDialogState({ isOpen: true, action: "change-email" })
            }
          >
            <Mail />
            Change Email
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center justify-start gap-2 p-2 cursor-pointer"
            onClick={() =>
              setDialogState({ isOpen: true, action: "change-password" })
            }
          >
            <RectangleEllipsis />
            Change Password
          </DropdownMenuItem>
          <Separator />
          <DropdownMenuItem
            className="flex items-center justify-start gap-2 p-2 cursor-pointer text-destructive"
            onClick={() =>
              setDialogState({ isOpen: true, action: "delete-user" })
            }
          >
            <Trash />
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileActionsDialog
        open={dialogState.isOpen}
        setOpen={() => setDialogState({ isOpen: false, action: null })}
        title={dialogState.action ? actionConfig[dialogState.action].title : ""}
        description={
          dialogState.action ? actionConfig[dialogState.action].description : ""
        }
        form={dialogState.action ? actionConfig[dialogState.action].form : null}
      />
    </>
  );
};
