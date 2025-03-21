import { useState } from "react";

import { Loader2, Send, ShieldAlert } from "lucide-react";

import { authClient } from "@/auth/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const EmailVerificationAlert = ({ email }: { email: string }) => {
  const [emailVerificationPending, setEmailVerificationPending] =
    useState<boolean>(false);
  const { toast } = useToast();

  const handleResendVerificationEmail = async () => {
    await authClient.sendVerificationEmail(
      {
        email,
        callbackURL: "/dashboard",
      },
      {
        onRequest() {
          setEmailVerificationPending(true);
        },
        onError(context) {
          toast({
            title: "Error",
            variant: "destructive",
            description: context.error.message,
          });
          setEmailVerificationPending(false);
        },
        onSuccess() {
          toast({
            title: "Success",
            description: "Verification email sent successfully",
          });
          setEmailVerificationPending(false);
        },
      }
    );
  };

  return (
    <Alert
      className="flex justify-between items-center gap-4"
      variant="destructive"
    >
      <div className="flex gap-2">
        <ShieldAlert className="size-4 shrink-0" />
        <div>
          <AlertTitle>Email Verification Required</AlertTitle>
          <AlertDescription>
            Please verify your email address. Check your inbox for verification
            or use the button right here to resend.
          </AlertDescription>
        </div>
      </div>
      <Button
        variant="destructive"
        onClick={handleResendVerificationEmail}
        disabled={emailVerificationPending}
        size="sm"
        className="shrink-0 cursor-pointer"
      >
        {emailVerificationPending ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Send size={15} />
        )}
        Resend
      </Button>
    </Alert>
  );
};
