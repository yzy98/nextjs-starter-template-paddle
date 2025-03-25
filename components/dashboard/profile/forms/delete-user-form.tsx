import { Dispatch, SetStateAction } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { InputPassword } from "@/components/ui/input-password";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";



const deleteUserFormSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type DeleteUserFormData = z.infer<typeof deleteUserFormSchema>;

interface DeleteUserFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DeleteUserForm = ({ setOpen }: DeleteUserFormProps) => {
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<DeleteUserFormData>({
    resolver: zodResolver(deleteUserFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: DeleteUserFormData) => {
    const { password } = values;

    await authClient.deleteUser({
      password,
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Email sent",
          });
          form.reset();
          setOpen(false);
        },
        onError: (error) => {
          toast({
            title: "Error",
            variant: "destructive",
            description: error.error.message,
          });
        },
      },
      callbackURL: "/goodbye",
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 md:pb-0 pb-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              "Delete Account"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
