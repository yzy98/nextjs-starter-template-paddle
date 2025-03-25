"use client";

import { Dispatch, SetStateAction, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authClient } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { cn, convertImageToBase64 } from "@/lib/utils";

const editUserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.any().optional(),
});

type EditUserFormData = z.infer<typeof editUserFormSchema>;

interface EditUserFormProps {
  namePlaceholder: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditUserForm = ({
  namePlaceholder,
  setOpen,
}: EditUserFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: EditUserFormData) => {
    const { name } = values;

    await authClient.updateUser({
      name,
      image: image ? await convertImageToBase64(image) : undefined,
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "User updated successfully",
          });
          form.reset();
          setImage(null);
          setImagePreview(null);
          setOpen(false);
          router.refresh();
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.error.message,
            variant: "destructive",
          });
        },
      },
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-4", !isDesktop && "px-4")}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder={namePlaceholder}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>Profile Image (optional)</FormLabel>
              <div className="flex flex-col items-start gap-4">
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
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        // Handle the file select
                        const file = e.target.files?.[0] || null;

                        // Generate preview
                        if (file) {
                          setImage(file);
                          onChange(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setImagePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-muted-foreground"
                      {...fieldProps}
                    />
                  </FormControl>
                  {imagePreview && (
                    <X
                      className="cursor-pointer"
                      onClick={() => {
                        setImage(null);
                        setImagePreview(null);
                        onChange(null);
                      }}
                    />
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:pb-0 pb-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
