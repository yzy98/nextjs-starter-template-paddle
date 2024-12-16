-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "paddle_subscription_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "price_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "price_amount" TEXT NOT NULL,
    "price_currency" TEXT NOT NULL,
    "collection_mode" TEXT NOT NULL,
    "billing_cycle_interval" TEXT NOT NULL,
    "billing_cycle_frequency" INTEGER NOT NULL,
    "starts_at" TEXT,
    "renews_at" TEXT,
    "ends_at" TEXT,
    "trial_starts_at" TEXT,
    "trial_ends_at" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paddle_subscription_id_key" ON "Subscription"("paddle_subscription_id");

-- CreateIndex
CREATE INDEX "Subscription_user_id_idx" ON "Subscription"("user_id");

-- CreateIndex
CREATE INDEX "Subscription_price_id_idx" ON "Subscription"("price_id");

-- CreateIndex
CREATE INDEX "Subscription_product_id_idx" ON "Subscription"("product_id");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "Price"("paddle_price_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("paddle_product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
