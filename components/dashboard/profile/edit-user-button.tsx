import { Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
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
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/auth/client";
import { Edit, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn, convertImageToBase64 } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";

export const EditUserButton = () => {
  const [name, setName] = useState<string>();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const { data, isPending, error } = useSession();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerButton = (
    <Button size="sm" className="gap-2 cursor-pointer" variant="secondary">
      <Edit size={13} />
      Edit User
    </Button>
  );

  const editForm = (
    <div className={cn("grid gap-4", !isDesktop && "px-4")}>
      <div className="grid gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="name"
          placeholder={data?.user.name}
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Profile Image</Label>
        <div className="flex flex-col items-start gap-2">
          {imagePreview && (
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={imagePreview}
                alt="Profile preview"
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <div className="flex items-center gap-2 w-full">
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-muted-foreground"
            />
            {imagePreview && (
              <X
                className="cursor-pointer"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const UpdateButton = () => {
    return (
      <Button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await authClient.updateUser({
            image: image ? await convertImageToBase64(image) : undefined,
            name: name ? name : undefined,
            fetchOptions: {
              onSuccess: () => {
                toast({
                  title: "Success",
                  description: "User updated successfully",
                });
              },
              onError: (error) => {
                toast({
                  title: "Error",
                  description: error.error.message,
                });
              },
            },
          });
          setName("");
          router.refresh();
          setImage(null);
          setImagePreview(null);
          setIsLoading(false);
          setOpen(false);
        }}
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : "Update"}
      </Button>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Edit user information</DialogDescription>
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
          <DrawerTitle>Edit User</DrawerTitle>
          <DrawerDescription>Edit user information</DrawerDescription>
        </DrawerHeader>
        {editForm}
        <DrawerFooter>
          <UpdateButton />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
