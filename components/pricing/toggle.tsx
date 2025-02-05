import { Price } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ToggleProps {
  prices: Price[];
  interval: "month" | "year";
  setInterval: (interval: "month" | "year") => void;
}

export function Toggle({ prices, setInterval, interval }: ToggleProps) {
  const billingIntervalsSorted = [
    ...new Set(prices.map((price) => price.billing_cycle_interval)),
  ].sort((a, b) => {
    if (a === "month") return -1;
    if (b === "month") return 1;
    return 0;
  });

  const calculateSavings = () => {
    const monthlyPrice = parseInt(
      prices.find((p) => p.billing_cycle_interval === "month")
        ?.unit_price_amount || "0"
    );
    const yearlyPrice = parseInt(
      prices.find((p) => p.billing_cycle_interval === "year")
        ?.unit_price_amount || "0"
    );
    const monthlyCost = monthlyPrice * 12;
    const yearlyCost = yearlyPrice;
    const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
    return Math.round(savings);
  };

  return (
    <div className="flex justify-center mb-8">
      <Tabs
        value={interval}
        onValueChange={(value) => setInterval(value as "month" | "year")}
      >
        <TabsList>
          {billingIntervalsSorted.map((billingInterval, index) => (
            <TabsTrigger
              key={index}
              value={billingInterval || "month"}
              className="relative"
            >
              {billingInterval || "Month"}
              {billingInterval === "year" && (
                <Badge
                  variant="destructive"
                  className="absolute -right-8 -top-3 text-xs"
                >
                  -{calculateSavings()}%
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
