import Image from "next/image";

import { cn } from "@/lib/utils";

type PriceTitleProps = {
  title: string;
  imageUrl?: string;
  featured: boolean;
};

export const PriceTitle = ({ title, imageUrl, featured }: PriceTitleProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center px-8 pt-8",
        "min-h-[80px]",
        "lg:w-[320px]",
        {
          "featured-price-title": featured,
        }
      )}
    >
      <div className="flex items-center gap-3">
        {imageUrl && (
          <div className="relative w-10 h-10">
            <Image src={imageUrl} fill className="object-contain" alt={title} />
          </div>
        )}
        <p className="text-[22px] leading-[32px] font-semibold text-foreground">
          {title}
        </p>
      </div>
      {featured && (
        <div className="flex items-center px-3 py-1 rounded-full border border-primary bg-primary/10 text-primary text-[14px] font-medium h-[32px] leading-[21px] featured-card-badge">
          Most popular
        </div>
      )}
    </div>
  );
};
