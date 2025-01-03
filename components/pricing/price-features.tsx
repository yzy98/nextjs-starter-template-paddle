import { CircleCheck } from "lucide-react";

interface PriceFeaturesProps {
  description: string;
  isPremium: boolean;
}

export const PriceFeatures = ({
  description,
  isPremium,
}: PriceFeaturesProps) => {
  const features = description.split(";").filter((feature) => feature.trim());

  return (
    <div className="px-8 min-h-[200px] min-w-[250px] lg:min-w-[350px]">
      <h3 className="font-medium text-lg mb-6">
        {isPremium ? "Everything in basic, plus" : "Basic Features"}
      </h3>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <CircleCheck className="size-4 text-primary" />
            <span className="text-[16px] text-muted-foreground leading-relaxed">
              {feature.trim()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
