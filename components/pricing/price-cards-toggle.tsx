"use client";

import { useState } from "react";
import { Product, Price } from "@prisma/client";

import { PriceCards } from "./price-cards";
import { Toggle } from "./toggle";

type PriceCardsToggleProps = {
  products: Product[];
  prices: Price[];
};

export const PriceCardsToggle = ({
  products,
  prices,
}: PriceCardsToggleProps) => {
  const [interval, setInterval] = useState<"month" | "year">("month");

  const filteredPricesSorted = prices
    .filter((price) => price.billing_cycle_interval === interval)
    .sort(
      (a, b) => parseInt(a.unit_price_amount) - parseInt(b.unit_price_amount)
    );

  return (
    <div className="mx-auto max-w-7xl relative px-[32px] flex flex-col items-center justify-between">
      <Toggle prices={prices} interval={interval} setInterval={setInterval} />
      <PriceCards allProducts={products} allPrices={filteredPricesSorted} />
    </div>
  );
};
