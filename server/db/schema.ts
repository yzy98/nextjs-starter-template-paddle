import { relations } from "drizzle-orm";
import {
  timestamp,
  integer,
  json,
  pgTable,
  serial,
  varchar,
  index,
  foreignKey,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id").unique().notNull(),
  createdTime: timestamp("created_time", { mode: "date" })
    .defaultNow()
    .notNull(),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  gender: varchar("gender"),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  paddleProductId: varchar("paddle_product_id").unique().notNull(),
  name: varchar("name").notNull(),
  type: varchar("type"),
  description: varchar("description"),
  taxCategory: varchar("tax_category").notNull(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
});

export const productsRelations = relations(products, ({ many }) => ({
  prices: many(prices),
  subscriptions: many(subscriptions),
}));

export const prices = pgTable(
  "prices",
  {
    id: serial("id").primaryKey(),
    paddlePriceId: varchar("paddle_price_id").unique().notNull(),
    productId: varchar("product_id").notNull(),
    description: varchar("description").notNull(),
    name: varchar("name"),
    billingCycleInterval: varchar("billing_cycle_interval"),
    billingCycleFrequency: integer("billing_cycle_frequency"),
    trialPeriodInterval: varchar("trial_period_interval"),
    trialPeriodFrequency: integer("trial_period_frequency"),
    taxMode: varchar("tax_mode").notNull(),
    unitPriceAmount: integer("unit_price_amount").notNull(),
    unitPriceCurrency: varchar("unit_price_currency").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull(),
  },
  (table) => [
    index("product_id_idx").on(table.productId),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.paddleProductId],
      name: "product_id_fk",
    }),
  ]
);

export const pricesRelations = relations(prices, ({ one, many }) => ({
  product: one(products, {
    fields: [prices.productId],
    references: [products.paddleProductId],
  }),
  subscriptions: many(subscriptions),
}));

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: serial("id").primaryKey(),
    paddleSubscriptionId: varchar("paddle_subscription_id").unique().notNull(),
    userId: varchar("user_id").notNull(),
    priceId: varchar("price_id").notNull(),
    productId: varchar("product_id").notNull(),
    status: varchar("status").notNull(),

    // Billing details
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: varchar("price_currency").notNull(),
    collectionMode: varchar("collection_mode").notNull(),
    billingCycleInterval: varchar("billing_cycle_interval").notNull(),
    billingCycleFrequency: integer("billing_cycle_frequency").notNull(),

    // Timestamps
    startsAt: timestamp("starts_at", { mode: "date" }),
    renewsAt: timestamp("renews_at", { mode: "date" }),
    endsAt: timestamp("ends_at", { mode: "date" }),
    trialStartsAt: timestamp("trial_starts_at", { mode: "date" }),
    trialEndsAt: timestamp("trial_ends_at", { mode: "date" }),
    canceledAt: timestamp("canceled_at", { mode: "date" }),
    scheduledChange: json("scheduled_change"),
  },
  (table) => [
    index("subscription_user_id_idx").on(table.userId),
    index("subscription_price_id_idx").on(table.priceId),
    index("subscription_product_id_idx").on(table.productId),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.clerkId],
      name: "user_id_fk",
    }),
    foreignKey({
      columns: [table.priceId],
      foreignColumns: [prices.paddlePriceId],
      name: "price_id_fk",
    }),
    foreignKey({
      columns: [table.productId],
      foreignColumns: [products.paddleProductId],
      name: "product_id_fk",
    }),
  ]
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.clerkId],
  }),
  price: one(prices, {
    fields: [subscriptions.priceId],
    references: [prices.paddlePriceId],
  }),
  product: one(products, {
    fields: [subscriptions.productId],
    references: [products.paddleProductId],
  }),
}));
