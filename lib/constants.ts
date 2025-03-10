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

export const ACTIVE_SUBSCRIPTION_STATUSES = [
  "active",
  "trialing",
  "past_due",
  "paused",
];
