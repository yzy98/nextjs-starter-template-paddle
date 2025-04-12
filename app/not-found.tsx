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

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center text-4xl mb-2">
            <span role="img" aria-label="magnifying glass">
              🔍
            </span>
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
          <CardDescription>Oops! This page doesn&apos;t exist</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p>
            The page you&apos;re looking for might have been moved or deleted.
          </p>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium mb-2">You can try:</p>
            <ul className="list-inside space-y-1 text-muted-foreground">
              <li>Checking the URL for typos</li>
              <li>Going back to the homepage</li>
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
