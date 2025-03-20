"use client";

import { use, useState } from "react";

import { Product, Price } from "@/server/db/schema";

import { PriceCards } from "./price-cards";
import { Toggle } from "./toggle";

type PriceCardsToggleProps = {
  productsAndPricesPromise: Promise<{
    products: Product[];
    prices: Price[];
  }>;
};

export const PriceCardsToggle = ({
  productsAndPricesPromise,
}: PriceCardsToggleProps) => {
  const [interval, setInterval] = useState<"month" | "year">("month");
  const { products, prices } = use(productsAndPricesPromise);

  const filteredPricesSorted = prices
    .filter((price) => price.billingCycleInterval === interval)
    .sort((a, b) => a.unitPriceAmount - b.unitPriceAmount);

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      <Toggle prices={prices} interval={interval} setInterval={setInterval} />
      <PriceCards allProducts={products} allPrices={filteredPricesSorted} />
    </div>
  );
};
