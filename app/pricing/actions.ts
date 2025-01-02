"use server";

import prisma from "@/lib/db";
import { getPaddleInstance } from "@/lib/paddle/get-paddle-instance";
import { Product, Price } from "@paddle/paddle-node-sdk";
import { Price as PrismaPrice, Product as PrismaProduct } from "@prisma/client";
import { unstable_cache } from "next/cache";

export async function getPaddleProducts() {
  const paddle = getPaddleInstance();

  try {
    const productCollection = paddle.products.list();
    let allProducts: Product[] = [];

    do {
      const singlePageProducts = await productCollection.next();
      allProducts = [...allProducts, ...singlePageProducts];
    } while (productCollection.hasMore);

    return allProducts;
  } catch (error) {
    console.error("Error fetching Paddle products:", error);
    throw error;
  }
}

export async function getPaddlePrices() {
  const paddle = getPaddleInstance();

  try {
    const priceCollection = paddle.prices.list();
    let allPrices: Price[] = [];

    do {
      const singlePagePrices = await priceCollection.next();
      allPrices = [...allPrices, ...singlePagePrices];
    } while (priceCollection.hasMore);

    return allPrices;
  } catch (error) {
    console.error("Error fetching Paddle prices:", error);
    throw error;
  }
}

export async function syncProducts() {
  // Fetch all products from db
  const products = await prisma.product.findMany();

  // Helper function to add a product to the products array and sync it with the db
  async function addProduct(product: Omit<PrismaProduct, "id">) {
    console.log(`Syncing product ${product.name} with the database...`);

    const result = await prisma.product.upsert({
      where: { paddle_product_id: product.paddle_product_id },
      update: product,
      create: product,
    });

    console.log(`Product ${product.name} synced with the database.`);
    products.push(result);
  }

  // Fetch all products from paddle
  const paddleProducts = await getPaddleProducts();

  for (const paddleProduct of paddleProducts) {
    // Skip archived products
    if (paddleProduct.status === "archived") {
      continue;
    }

    const paddle_product_id = paddleProduct.id;
    const name = paddleProduct.name;
    const type = paddleProduct.type;
    const description = paddleProduct?.description;
    const tax_category = paddleProduct?.taxCategory;
    const image_url = paddleProduct?.imageUrl;
    const created_at = paddleProduct.createdAt;
    const updated_at = paddleProduct.updatedAt;

    await addProduct({
      paddle_product_id,
      name,
      type,
      description,
      tax_category,
      image_url,
      created_at,
      updated_at,
    });
  }

  return products;
}

export async function syncPrices() {
  // Fetch all prices from db
  const prices = await prisma.price.findMany();

  // Helper function to add a price to the prices array and sync it with the db
  async function addPrice(price: Omit<PrismaPrice, "id">) {
    console.log(`Syncing price ${price.name} with the database...`);

    const result = await prisma.price.upsert({
      where: { paddle_price_id: price.paddle_price_id },
      update: price,
      create: price,
    });

    console.log(`Price ${price.name} synced with the database.`);
    prices.push(result);
  }

  // Fetch all prices from paddle
  const paddlePrices = await getPaddlePrices();

  for (const paddlePrice of paddlePrices) {
    // Skip archived prices
    if (paddlePrice.status === "archived") {
      continue;
    }

    const paddle_price_id = paddlePrice.id;
    const product_id = paddlePrice.productId;
    const description = paddlePrice.description;
    const name = paddlePrice?.name;
    const billing_cycle_interval = paddlePrice?.billingCycle?.interval ?? null;
    const billing_cycle_frequency =
      paddlePrice?.billingCycle?.frequency ?? null;
    const trial_period_interval = paddlePrice?.trialPeriod?.interval ?? null;
    const trial_period_frequency = paddlePrice?.trialPeriod?.frequency ?? null;
    const tax_mode = paddlePrice.taxMode;
    const unit_price_amount = paddlePrice.unitPrice.amount;
    const unit_price_currency = paddlePrice.unitPrice.currencyCode;
    const created_at = paddlePrice.createdAt;
    const updated_at = paddlePrice.updatedAt;

    await addPrice({
      paddle_price_id,
      product_id,
      description,
      name,
      billing_cycle_interval,
      billing_cycle_frequency,
      trial_period_interval,
      trial_period_frequency,
      tax_mode,
      unit_price_amount,
      unit_price_currency,
      created_at,
      updated_at,
    });
  }

  return prices;
}

export const getAllProductsAndPrices = unstable_cache(
  async () => {
    let [products, prices] = await Promise.all([
      prisma.product.findMany(),
      prisma.price.findMany(),
    ]);

    // If there are no products, sync them from Paddle
    if (!products.length) {
      products = await syncProducts();
    }

    // If there are no prices, sync them from Paddle
    if (!prices.length) {
      prices = await syncPrices();
    }

    return { products, prices };
  },
  ["products-and-prices"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["products-and-prices"],
  }
);
