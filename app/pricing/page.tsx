import { Suspense } from "react";

import { PlanComparison } from "@/components/pricing/plan-comparison";
import { PlanComparisonSkeleton } from "@/components/pricing/plan-comparison-skeleton";
import { PriceCardsToggle } from "@/components/pricing/price-cards-toggle";
import { PriceCardsToggleSkeleton } from "@/components/pricing/price-cards-toggle-skeleton";

import { getAllProductsAndPrices } from "./actions";

export default function PricingPage() {
  const productsAndPricesPromise = getAllProductsAndPrices();

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">
          Choose the plan that&apos; right for you
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <Suspense fallback={<PriceCardsToggleSkeleton />}>
          <PriceCardsToggle
            productsAndPricesPromise={productsAndPricesPromise}
          />
        </Suspense>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
        <Suspense fallback={<PlanComparisonSkeleton />}>
          <PlanComparison productsAndPricesPromise={productsAndPricesPromise} />
        </Suspense>
      </div>
    </div>
  );
}
