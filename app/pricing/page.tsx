import prisma from "@/lib/db";
import { PriceCardsToggle } from "@/components/pricing/price-cards-toggle";

import { syncPrices, syncProducts } from "./actions";

export default async function PricingPage() {
  let allProducts = await prisma.product.findMany();
  let allPrices = await prisma.price.findMany();

  // If there are no products, sync them from Paddle
  if (!allProducts.length) {
    allProducts = await syncProducts();
  }

  // If there are no prices, sync them from Paddle
  if (!allPrices.length) {
    allPrices = await syncPrices();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600">
          Choose the plan that's right for you
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <PriceCardsToggle products={allProducts} prices={allPrices} />
      </div>
    </div>
  );
}
