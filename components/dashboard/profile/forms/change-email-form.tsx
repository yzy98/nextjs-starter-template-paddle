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
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";



const changeEmailFormSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
});

type ChangeEmailFormData = z.infer<typeof changeEmailFormSchema>;

interface ChangeEmailFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const ChangeEmailForm = ({ setOpen }: ChangeEmailFormProps) => {
  const { toast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const form = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      newEmail: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: ChangeEmailFormData) => {
    const { newEmail } = values;

    await authClient.changeEmail({
      newEmail,
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Email change verification sent",
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
      callbackURL: "/dashboard/profile",
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
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Email</FormLabel>
              <FormControl>
                <Input placeholder="New email" {...field} />
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
              "Change Email"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
