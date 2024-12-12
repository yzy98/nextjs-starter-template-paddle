import prisma from "@/lib/db";

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
    <div>
      <div>{JSON.stringify(allProducts)}</div>
      <div>{JSON.stringify(allPrices)}</div>
    </div>
  );
}
