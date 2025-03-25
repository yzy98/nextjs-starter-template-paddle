"use server";

import { unstable_cache } from "next/cache";

import { DB_MUTATIONS } from "@/server/db/mutations";
import { DB_QUERIES } from "@/server/db/queries";
import { NewPrice, NewProduct } from "@/server/db/schema";
import { PADDLE_QUERIES } from "@/server/paddle/queries";

export async function syncProducts() {
  // Fetch all products from db
  const products = await DB_QUERIES.getProducts();

  // Helper function to add a product to the products array and sync it with the db
  async function addProduct(product: NewProduct) {
    console.log(`Syncing product ${product.name} with the database...`);
    const result = await DB_MUTATIONS.upsertProduct(product);
    console.log(`Product ${result.name} synced with the database.`);
    products.push(result);
  }

  // Fetch all products from paddle
  const paddleProducts = await PADDLE_QUERIES.getAllProducts();

  for (const paddleProduct of paddleProducts) {
    // Skip archived products
    if (paddleProduct.status === "archived") {
      continue;
    }

    const paddleProductId = paddleProduct.id;
    const name = paddleProduct.name;
    const type = paddleProduct.type;
    const description = paddleProduct?.description;
    const taxCategory = paddleProduct?.taxCategory;
    const imageUrl = paddleProduct?.imageUrl;
    const createdAt = new Date(paddleProduct.createdAt);
    const updatedAt = new Date(paddleProduct.updatedAt);

    await addProduct({
      paddleProductId,
      name,
      type,
      description,
      taxCategory,
      imageUrl,
      createdAt,
      updatedAt,
    });
  }

  return products;
}

export async function syncPrices() {
  // Fetch all prices from db
  const prices = await DB_QUERIES.getPrices();

  // Helper function to add a price to the prices array and sync it with the db
  async function addPrice(price: NewPrice) {
    console.log(`Syncing price ${price.name} with the database...`);
    const result = await DB_MUTATIONS.upsertPrice(price);
    console.log(`Price ${result.name} synced with the database.`);
    prices.push(result);
  }

  // Fetch all prices from paddle
  const paddlePrices = await PADDLE_QUERIES.getAllPrices();

  for (const paddlePrice of paddlePrices) {
    // Skip archived prices
    if (paddlePrice.status === "archived") {
      continue;
    }

    const paddlePriceId = paddlePrice.id;
    const productId = paddlePrice.productId;
    const description = paddlePrice.description;
    const name = paddlePrice?.name;
    const billingCycleInterval = paddlePrice?.billingCycle?.interval ?? null;
    const billingCycleFrequency = paddlePrice?.billingCycle?.frequency ?? null;
    const trialPeriodInterval = paddlePrice?.trialPeriod?.interval ?? null;
    const trialPeriodFrequency = paddlePrice?.trialPeriod?.frequency ?? null;
    const taxMode = paddlePrice.taxMode;
    const unitPriceAmount = parseInt(paddlePrice.unitPrice.amount);
    const unitPriceCurrency = paddlePrice.unitPrice.currencyCode;
    const createdAt = new Date(paddlePrice.createdAt);
    const updatedAt = new Date(paddlePrice.updatedAt);

    await addPrice({
      paddlePriceId,
      productId,
      description,
      name,
      billingCycleInterval,
      billingCycleFrequency,
      trialPeriodInterval,
      trialPeriodFrequency,
      taxMode,
      unitPriceAmount,
      unitPriceCurrency,
      createdAt,
      updatedAt,
    });
  }

  return prices;
}

export const getAllProductsAndPrices = unstable_cache(
  async () => {
    let [products, prices] = await Promise.all([
      DB_QUERIES.getProducts(),
      DB_QUERIES.getPrices(),
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
