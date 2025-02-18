import { SortField } from "@/stores/use-inactive-subscriptions-store";

export const ITEMS_PER_PAGE = 5;
export const SUBSCRIPTION_HISTORY_PAGE_SIZE = 5;
export const SUBSCRIPTION_HISTORY_FIELDS: SortField[] = [
  "plan",
  "interval",
  "price",
  "start",
  "end",
  "status",
];
export const SORT_FIELD_MAPPING: Record<SortField, string> = {
  plan: "product",
  interval: "billing_cycle_interval",
  price: "price_amount",
  status: "status",
  start: "starts_at",
  end: "ends_at",
};
