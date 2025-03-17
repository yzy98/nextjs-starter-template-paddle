"use client";

import Link from "next/link";

import { CheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfetti } from "@/hooks/use-confetti";

export default function CheckoutSuccessPage() {
  useConfetti();

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 text-center">
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold">Payment Successful!</h1>

        <p className="text-muted-foreground">
          Thank you for your purchase. You will receive a confirmation email
          shortly.
        </p>

        <div className="pt-6">
          <Link href="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
