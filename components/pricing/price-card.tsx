import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Price, Product } from "@prisma/client";

import { cn, formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { PriceTitle } from "./price-title";
import { PriceAmount } from "./price-amount";
import { PriceFeatures } from "./price-features";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";

type PriceCardProps = {
  price: Price;
  product: Product;
};

export const PriceCard = ({ price, product }: PriceCardProps) => {
  const { toast } = useToast();
  const { user } = useUser();

  const isPremium = product.name === "Premium";

  const PriceCardContainer = isPremium ? BackgroundGradient : "div";
  const containerClassName = isPremium
    ? "rounded-[22px] bg-card/70"
    : "rounded-[22px] bg-card/70 border border-border";

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your purchase.",
      });
    }

    redirect(`/checkout/${price.paddle_price_id}`);
  };

  const buttonClassName = cn(
    "w-full h-12 text-[15px] font-medium",
    "transition-all duration-300",
    isPremium && "hover:scale-[1.02]",
    isPremium
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "bg-muted text-muted-foreground cursor-default"
  );

  return (
    <PriceCardContainer className={containerClassName}>
      <div className="flex gap-6 flex-col p-1 rounded-xl">
        <PriceTitle
          title={price?.name ?? product.name}
          imageUrl={product?.image_url ?? undefined}
        />
        <PriceAmount
          price={formatPrice(
            price.unit_price_amount.toString(),
            price.unit_price_currency
          )}
          interval={price?.billing_cycle_interval ?? undefined}
          frequency={price?.billing_cycle_frequency ?? undefined}
        />
        <div className="px-8">
          <Separator className="bg-border" />
        </div>
        <PriceFeatures
          description={product.description ?? ""}
          isPremium={isPremium}
        />
      </div>
      <div className="p-8 pt-6">
        <Button
          className={buttonClassName}
          onClick={handleClick}
          disabled={!isPremium}
        >
          {isPremium ? "Get started" : "Free plan"}
        </Button>
      </div>
    </PriceCardContainer>
  );
};
