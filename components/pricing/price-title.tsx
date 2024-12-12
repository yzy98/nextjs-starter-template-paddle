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
      className={cn("flex justify-between items-center px-8 pt-8", {
        "featured-price-title": featured,
      })}
    >
      <div className={"flex items-center gap-[10px]"}>
        {imageUrl && (
          <Image src={imageUrl} height={40} width={40} alt={title} />
        )}
        <p className={"text-[20px] leading-[30px] font-semibold"}>{title}</p>
      </div>
      {featured && (
        <div
          className={
            "flex items-center px-3 py-1 rounded-xs border border-secondary-foreground/10 text-[14px] h-[29px] leading-[21px] featured-card-badge"
          }
        >
          Most popular
        </div>
      )}
    </div>
  );
};
