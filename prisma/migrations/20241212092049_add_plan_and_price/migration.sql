-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "paddle_product_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "tax_category" TEXT NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "paddle_price_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT,
    "billing_cycle_interval" TEXT,
    "billing_cycle_frequency" INTEGER,
    "trial_period_interval" TEXT,
    "trial_period_frequency" INTEGER,
    "tax_mode" TEXT NOT NULL,
    "unit_price_amount" TEXT NOT NULL,
    "unit_price_currency" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_paddle_product_id_key" ON "Product"("paddle_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Price_paddle_price_id_key" ON "Price"("paddle_price_id");

-- CreateIndex
CREATE INDEX "Price_product_id_idx" ON "Price"("product_id");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("paddle_product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
