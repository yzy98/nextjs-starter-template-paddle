import Image from "next/image";

type PriceTitleProps = {
  title: string;
  imageUrl?: string;
};

export const PriceTitle = ({ title, imageUrl }: PriceTitleProps) => {
  return (
    <div className="flex justify-between items-center px-8 pt-8 min-h-[80px] lg:w-[320px]">
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
    </div>
  );
};
