import { cn, formatPrice } from "@/lib/utils";
import { Price, Product } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

  return (
    <div
      className={cn(
        "rounded-2xl bg-background/80 backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300",
        "border border-border/50 hover:border-primary/20",
        "transform hover:-translate-y-1"
      )}
    >
      <div className={cn("flex gap-6 flex-col p-1", "rounded-xl")}>
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
          <Separator className={"bg-border/30"} />
        </div>
        <div
          className={"px-8 text-[16px] leading-relaxed text-muted-foreground"}
        >
          {price.description}
        </div>
      </div>
      <div className={"p-8 pt-6"}>
        <Button
          className={cn(
            "w-full h-12 text-[15px] font-medium",
            "transition-all duration-300",
            "hover:scale-[1.02]"
          )}
          variant={"secondary"}
          onClick={handleClick}
        >
          Get started
        </Button>
      </div>
    </div>
  );
};
