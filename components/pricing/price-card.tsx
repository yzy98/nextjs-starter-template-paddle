import { cn, formatPrice } from "@/lib/utils";
import { Price, Product } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

import { PriceTitle } from "./price-title";
import { PriceAmount } from "./price-amount";
import { redirect } from "next/navigation";

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
    ? "rounded-[22px] bg-card/90"
    : "rounded-[22px] bg-card/90 border border-border";

  const handleClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      toast({
        title: "Authentication required",
        description: "Please sign in to continue with your purchase.",
        variant: "destructive",
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
      <div className={cn("flex gap-6 flex-col p-1", "rounded-xl")}>
        <PriceTitle
          title={price?.name ?? product.name}
          imageUrl={product?.image_url ?? undefined}
          featured={isPremium}
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
        <div
          className={"px-8 text-[16px] leading-relaxed text-muted-foreground"}
        >
          {price.description}
        </div>
      </div>
      <div className={"p-8 pt-6"}>
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
