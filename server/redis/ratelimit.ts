import { Ratelimit } from "@upstash/ratelimit";
import { redis } from ".";

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10s"),
});
