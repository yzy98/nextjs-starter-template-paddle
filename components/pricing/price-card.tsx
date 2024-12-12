import { cn, formatPrice } from "@/lib/utils";
import { Price, Product } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { PriceTitle } from "./price-title";
import { PriceAmount } from "./price-amount";

type PriceCardProps = {
  price: Price;
  product: Product;
};

export const PriceCard = ({ price, product }: PriceCardProps) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-background/70 backdrop-blur-[6px] overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border"
        )}
      >
        <PriceTitle
          title={price?.name ?? product.name}
          imageUrl={product?.image_url ?? undefined}
          featured={product.name === "Premium"}
        />
        <PriceAmount
          price={formatPrice(
            price.unit_price_amount,
            price.unit_price_currency
          )}
          interval={price?.billing_cycle_interval ?? undefined}
          frequency={price?.billing_cycle_frequency ?? undefined}
        />
        <div className={"px-8"}>
          <Separator className={"bg-border"} />
        </div>
        <div className={"px-8 text-[16px] leading-[24px]"}>
          {price.description}
        </div>
      </div>
      <div className={"px-8 mt-8"}>
        <Button className={"w-full"} variant={"secondary"} asChild={true}>
          {/* <Link href={`/checkout/${tier.priceId[frequency.value]}`}>
            Get started
          </Link> */}
          Get started
        </Button>
      </div>
    </div>
  );
};
