import { CheckoutContents } from "@/components/checkout/checkout-contents";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
