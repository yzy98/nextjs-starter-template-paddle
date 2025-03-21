"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signIn } from "@/auth/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { useToast } from "@/hooks/use-toast";


const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});

type SignInFormData = z.infer<typeof signInFormSchema>;

export const SignIn = () => {
  const [isGithubSigningIn, setIsGithubSigningIn] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const isSigningIn =
    form.formState.isSubmitting || isGithubSigningIn || isGoogleSigningIn;

  const onSubmit = async (values: SignInFormData) => {
    const { email, password, rememberMe } = values;
    await signIn.email({
      email,
      password,
      rememberMe,
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "You have been logged in",
          });
          router.push("/dashboard");
        },
        onError: (error) => {
          console.log(error.error.message);
          toast({
            title: "Error",
            description: error.error.message || "Failed to log in",
            variant: "destructive",
          });
        },
      },
    });
  };

  const handleGithubSignIn = async () => {
    setIsGithubSigningIn(true);
    await signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Signed in with Github",
          });
          router.push("/dashboard");
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to sign in with Github",
          });
        },
      },
    });
    setIsGithubSigningIn(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Signed in with Google",
          });
          router.push("/dashboard");
        },
        onError: (error) => {
          console.log(error);
          toast({
            title: "Error",
            description: "Failed to sign in with Google",
          });
        },
      },
    });
    setIsGoogleSigningIn(false);
  };

  return (
    <Card className="z-50 rounded-none max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com"
                      disabled={isSigningIn}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <InputPassword
                      placeholder="Password"
                      disabled={isSigningIn}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        disabled={isSigningIn}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Remember me</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSigningIn}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        {/* Social Sign In */}
        <div className="w-full flex flex-col gap-2 items-center justify-between">
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGithubSignIn}
            disabled={isSigningIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              ></path>
            </svg>
            {isGithubSigningIn ? "Signing in..." : "Sign in with Github"}
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.98em"
              height="1em"
              viewBox="0 0 256 262"
            >
              <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
              ></path>
              <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
              ></path>
              <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
              ></path>
              <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
              ></path>
            </svg>
            {isGoogleSigningIn ? "Signing in..." : "Sign in with Google"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
