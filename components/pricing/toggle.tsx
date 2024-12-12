import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Price } from "@prisma/client";

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

  return (
    <div className="flex justify-center mb-8">
      <Tabs
        value={interval}
        onValueChange={(value) => setInterval(value as "month" | "year")}
      >
        <TabsList>
          {billingIntervalsSorted.map((billingInterval, index) => (
            <TabsTrigger key={index} value={billingInterval || "month"}>
              {billingInterval || "Month"}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
