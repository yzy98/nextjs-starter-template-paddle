import { cn } from "@/lib/utils";

type PriceAmountProps = {
  price: string;
  interval?: string;
  frequency?: number;
};

export const PriceAmount = ({
  price,
  interval,
  frequency,
}: PriceAmountProps) => {
  return (
    <div className="mt-6 flex flex-col px-8">
      <div
        className={cn(
          "text-[80px] leading-[96px] tracking-[-1.6px] font-medium"
        )}
      >
        {price}
      </div>
      {interval && frequency && (
        <div className={cn("font-medium leading-[12px] text-[12px]")}>
          per user /{" "}
          {frequency > 1 ? `${frequency} ${interval}s` : `${interval}`}
        </div>
      )}
    </div>
  );
};
