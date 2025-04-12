import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GoodbyePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center text-4xl mb-2">
            <span role="img" aria-label="sad face">
              😢
            </span>
          </div>
          <CardTitle className="text-2xl">Account Deleted</CardTitle>
          <CardDescription>We&apos;re sorry to see you go</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            Your account has been successfully deleted and all your data has
            been removed.
          </p>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-2">What&apos;s next:</p>
            <ul className="list-inside space-y-1 text-muted-foreground">
              <li>No more emails from us</li>
              <li>To return, you&apos;ll need a new account</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
