import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: string, currencyCode: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatMoney(amount: number = 0, currency: string = "USD") {
  const language =
    typeof navigator !== "undefined" ? navigator.language : "en-US";
  return new Intl.NumberFormat(language ?? "en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "/";

  const date = dateString instanceof Date ? dateString : new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "trialing":
      return "Trial Period";
    case "past_due":
      return "Payment Due";
    case "paused":
      return "Paused";
    case "canceled":
      return "Canceled";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};
