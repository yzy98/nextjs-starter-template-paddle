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
    <div className="flex flex-col gap-4">
      <PriceCardsToggle products={allProducts} prices={allPrices} />
    </div>
  );
}
