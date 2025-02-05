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
    <div className="flex flex-col px-8">
      <div className="text-[64px] leading-[76px] tracking-[-1.6px] font-medium min-h-[76px] flex items-center lg:w-[280px] text-foreground">
        {price}
      </div>
      {interval && frequency && (
        <div className="font-medium text-[14px] leading-[20px] text-muted-foreground mt-2">
          per user / {frequency > 1 ? `${frequency} ${interval}s` : interval}
        </div>
      )}
    </div>
  );
};
