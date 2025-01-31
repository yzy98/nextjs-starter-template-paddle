import { CheckoutLineItems } from "@/components/checkout/checkout-line-items";
import { CheckoutPriceContainer } from "@/components/checkout/checkout-price-container";
import { CheckoutPriceAmount } from "@/components/checkout/checkout-price-amount";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function PriceSection({ checkoutData }: Props) {
  return (
    <>
      <div className="hidden md:block">
        <CheckoutPriceContainer checkoutData={checkoutData} />
        <CheckoutLineItems checkoutData={checkoutData} />
      </div>
      <div className="block md:hidden px-[10px]">
        <CheckoutPriceAmount checkoutData={checkoutData} />
        <Separator className="relative bg-border/50 mt-6 checkout-order-summary-mobile-yellow-highlight" />
        <Accordion type="single" collapsible>
          <AccordionItem className="border-none" value="item-1">
            <AccordionTrigger className="text-muted-foreground no-underline!">
              Order summary
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <CheckoutLineItems checkoutData={checkoutData} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
