/**
 * Check if the value is an object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Type guard to check if the object is a valid Paddle event
 */
export function isPaddleEvent(obj: unknown): obj is {
  event_id: string;
  event_type: string;
  occurred_at: string;
  data: Record<string, unknown>;
} {
  if (!isObject(obj)) return false;

  return (
    typeof obj.event_id === "string" &&
    typeof obj.event_type === "string" &&
    typeof obj.occurred_at === "string" &&
    isObject(obj.data)
  );
}

interface SubscriptionItem {
  status: string;
  quantity: number;
  recurring: boolean;
  created_at: string;
  updated_at: string;
  previously_billed_at: string | null;
  next_billed_at: string | null;
  trial_dates: {
    starts_at?: string;
    ends_at?: string;
  } | null;
  price: {
    id: string;
    unit_price: {
      amount: string;
    };
    [key: string]: unknown;
  };
  product: {
    id: string;
    [key: string]: unknown;
  };
}

/**
 * Type guard to check if an object is a valid subscription item
 */
function isSubscriptionItem(item: unknown): item is SubscriptionItem {
  if (!isObject(item)) return false;

  return (
    typeof item.status === "string" &&
    typeof item.quantity === "number" &&
    typeof item.recurring === "boolean" &&
    typeof item.created_at === "string" &&
    typeof item.updated_at === "string" &&
    (item.previously_billed_at === null ||
      typeof item.previously_billed_at === "string") &&
    (item.next_billed_at === null || typeof item.next_billed_at === "string") &&
    (item.trial_dates === null || isObject(item.trial_dates)) &&
    isObject(item.price) &&
    typeof item.price.id === "string" &&
    isObject(item.product) &&
    typeof item.product.id === "string"
  );
}

/**
 * Type guard to check if the object is a subscription event
 */
export function isPaddleSubscriptionEvent(obj: unknown): obj is {
  event_type:
    | "subscription.created"
    | "subscription.updated"
    | "subscription.canceled";
  data: {
    id: string;
    items: SubscriptionItem[];
    status: string;
    customer_id: string;
    address_id: string;
    business_id: string | null;
    currency_code: string;
    collection_mode: string;
    created_at: string;
    updated_at: string;
    started_at: string | null;
    first_billed_at: string | null;
    next_billed_at: string | null;
    paused_at: string | null;
    canceled_at: string | null;
    custom_data: {
      user_id: string;
    } | null;
    billing_cycle: {
      interval: string;
      frequency: number;
    };
    current_billing_period: {
      starts_at: string;
      ends_at: string;
    } | null;
  };
} {
  if (!isPaddleEvent(obj)) return false;

  const subscriptionEventTypes = [
    "subscription.created",
    "subscription.updated",
    "subscription.canceled",
  ];

  if (!subscriptionEventTypes.includes(obj.event_type)) return false;

  const data = obj.data;
  if (!isObject(data)) return false;

  // Check if items is an array and all items are valid subscription items
  if (!Array.isArray(data.items) || !data.items.every(isSubscriptionItem)) {
    return false;
  }

  return (
    typeof data.id === "string" &&
    data.id.startsWith("sub_") &&
    typeof data.status === "string" &&
    typeof data.customer_id === "string" &&
    typeof data.address_id === "string" &&
    (data.business_id === null || typeof data.business_id === "string") &&
    typeof data.currency_code === "string" &&
    typeof data.created_at === "string" &&
    typeof data.updated_at === "string" &&
    (data.started_at === null || typeof data.started_at === "string") &&
    (data.first_billed_at === null ||
      typeof data.first_billed_at === "string") &&
    (data.next_billed_at === null || typeof data.next_billed_at === "string") &&
    (data.paused_at === null || typeof data.paused_at === "string") &&
    (data.canceled_at === null || typeof data.canceled_at === "string") &&
    isObject(data.billing_cycle) &&
    typeof data.billing_cycle.interval === "string" &&
    typeof data.billing_cycle.frequency === "number" &&
    (data.current_billing_period === null ||
      (isObject(data.current_billing_period) &&
        typeof data.current_billing_period.starts_at === "string" &&
        typeof data.current_billing_period.ends_at === "string"))
  );
}
