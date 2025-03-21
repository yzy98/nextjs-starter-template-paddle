import { getPaddleInstance } from "@/server/paddle";
import { Product, Price } from "@paddle/paddle-node-sdk";

const paddle = getPaddleInstance();

export const PADDLE_QUERIES = {
  /**
   * Get all products
   */
  getAllProducts: async function () {
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
  },
  /**
   * Get all prices
   */
  getAllPrices: async function () {
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
  },
  /**
   * Get a subscription by ID
   */
  getSubscription: function (subscriptionId: string) {
    return paddle.subscriptions.get(subscriptionId);
  },
};
