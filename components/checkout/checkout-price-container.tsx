import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

import { CheckoutPriceAmount } from "@/components/checkout/checkout-price-amount";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/utils";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutPriceContainer({ checkoutData }: Props) {
  const recurringTotal = checkoutData?.recurring_totals?.total;
  return (
    <>
      <div className={"text-base leading-[20px] font-semibold"}>
        Order summary
      </div>
      <CheckoutPriceAmount checkoutData={checkoutData} />
      {recurringTotal !== undefined ? (
        <div
          className={
            "pt-4 text-base leading-[20px] font-medium text-muted-foreground"
          }
        >
          then{" "}
          {formatMoney(
            checkoutData?.recurring_totals?.total,
            checkoutData?.currency_code
          )}{" "}
          {checkoutData?.items?.[0]?.billing_cycle?.interval === "year"
            ? "annually"
            : "monthly"}
        </div>
      ) : (
        <Skeleton className="mt-4 h-[20px] w-full bg-border" />
      )}
    </>
  );
}
