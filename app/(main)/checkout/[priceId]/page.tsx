import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { CheckoutContents } from "@/components/checkout/checkout-contents";

export default async function CheckoutPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <CheckoutContents
      userEmail={user.emailAddresses[0].emailAddress}
      userId={user.id}
    />
  );
}
