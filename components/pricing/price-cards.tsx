import { Price, Product } from "@/server/db/schema";

import { PriceCard } from "./price-card";

type PriceCardsProps = {
  allProducts: Product[];
  allPrices: Price[];
};

export const PriceCards = ({ allProducts, allPrices }: PriceCardsProps) => {
  return (
    <div className="isolate mx-auto grid grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {allPrices.map((price) => {
        const product = allProducts.find(
          (product) => product.paddleProductId === price.productId
        );

        if (!product) return null;

        return <PriceCard key={price.id} price={price} product={product} />;
      })}
    </div>
  );
};
