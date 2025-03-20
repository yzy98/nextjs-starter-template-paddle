import { relations } from "drizzle-orm";
import {
  timestamp,
  integer,
  json,
  pgTable,
  serial,
  index,
  foreignKey,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const usersRelations = relations(users, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  paddleProductId: text("paddle_product_id").unique().notNull(),
  name: text("name").notNull(),
  type: text("type"),
  description: text("description"),
  taxCategory: text("tax_category").notNull(),
  imageUrl: text("image_url"),
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
    paddlePriceId: text("paddle_price_id").unique().notNull(),
    productId: text("product_id").notNull(),
    description: text("description").notNull(),
    name: text("name"),
    billingCycleInterval: text("billing_cycle_interval"),
    billingCycleFrequency: integer("billing_cycle_frequency"),
    trialPeriodInterval: text("trial_period_interval"),
    trialPeriodFrequency: integer("trial_period_frequency"),
    taxMode: text("tax_mode").notNull(),
    unitPriceAmount: integer("unit_price_amount").notNull(),
    unitPriceCurrency: text("unit_price_currency").notNull(),
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
    paddleSubscriptionId: text("paddle_subscription_id").unique().notNull(),
    userId: text("user_id").notNull(),
    priceId: text("price_id").notNull(),
    productId: text("product_id").notNull(),
    status: text("status").notNull(),

    // Billing details
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: text("price_currency").notNull(),
    collectionMode: text("collection_mode").notNull(),
    billingCycleInterval: text("billing_cycle_interval").notNull(),
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
      foreignColumns: [users.id],
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
    references: [users.id],
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

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Price = typeof prices.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewSession = typeof sessions.$inferInsert;
export type NewAccount = typeof accounts.$inferInsert;
export type NewVerification = typeof verifications.$inferInsert;
export type NewProduct = typeof products.$inferInsert;
export type NewPrice = typeof prices.$inferInsert;
export type NewSubscription = typeof subscriptions.$inferInsert;
