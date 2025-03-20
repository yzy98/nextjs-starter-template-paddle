import { auth } from "@/auth/server";
import { CheckoutContents } from "@/components/checkout/checkout-contents";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <CheckoutContents userEmail={session.user.email} userId={session.user.id} />
  );
}
