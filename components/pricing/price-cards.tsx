import { Product, Price } from "@prisma/client";

import { PriceCard } from "./price-card";

type PriceCardsProps = {
  allProducts: Product[];
  allPrices: Price[];
};

export const PriceCards = ({ allProducts, allPrices }: PriceCardsProps) => {
  return (
    <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {allPrices.map((price) => {
        const product = allProducts.find(
          (product) => product.paddle_product_id === price.product_id
        );

        if (!product) return null;

        return <PriceCard key={price.id} price={price} product={product} />;
      })}
    </div>
  );
};
