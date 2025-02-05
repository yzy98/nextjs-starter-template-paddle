"use client";

import { use } from "react";

import { Price, Product } from "@prisma/client";
import { CircleCheck } from "lucide-react";

interface PlanComparisonProps {
  productsAndPricesPromise: Promise<{
    products: Product[];
    prices: Price[];
  }>;
}

export function PlanComparison({
  productsAndPricesPromise,
}: PlanComparisonProps) {
  const { products } = use(productsAndPricesPromise);

  // Find free and premium products
  const freeProduct = products.find((p) => p.name === "Free");
  const premiumProduct = products.find((p) => p.name === "Premium");

  // Get features arrays
  const freeFeatures =
    freeProduct?.description?.split(";").filter((f) => f.trim()) || [];
  const premiumFeatures =
    premiumProduct?.description?.split(";").filter((f) => f.trim()) || [];

  // Combine all unique features
  const allFeatures = Array.from(
    new Set([...freeFeatures, ...premiumFeatures])
  );

  return (
    <div className="max-w-4xl mx-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-6">Plan</th>
            <th className="text-center py-4 px-6">Free</th>
            <th className="text-center py-4 px-6 bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Premium
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {allFeatures.map((feature, index) => (
            <tr key={index}>
              <td className="py-4 px-6 text-muted-foreground">{feature}</td>
              <td className="text-center py-4 px-6">
                {freeFeatures.includes(feature) && (
                  <CircleCheck className="size-4 text-primary mx-auto" />
                )}
              </td>
              <td className="text-center py-4 px-6">
                <CircleCheck className="size-4 text-primary mx-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
