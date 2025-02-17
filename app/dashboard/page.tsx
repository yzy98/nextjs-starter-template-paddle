import { ActiveSubscriptionSections } from "@/components/dashboard/active-subscription-sections";
import { InactiveSubscriptionSections } from "@/components/dashboard/inactive-subscription-sections";
import { HydrateClient, trpc } from "@/trpc/server";

export default async function Dashboard() {
  void trpc.subscriptions.getActive.prefetch();
  void trpc.subscriptions.getInactive.prefetch();

  return (
    <HydrateClient>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="space-y-4 md:space-y-6">
          <ActiveSubscriptionSections />
          <InactiveSubscriptionSections />
        </div>
      </div>
    </HydrateClient>
  );
}
