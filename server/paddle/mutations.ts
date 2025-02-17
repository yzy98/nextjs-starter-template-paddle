import { getPaddleInstance } from "@/server/paddle";
import {
  CancelSubscription,
  PauseSubscription,
  ResumeSubscription,
  UpdateSubscriptionRequestBody,
} from "@paddle/paddle-node-sdk";

const paddle = getPaddleInstance();

export const PADDLE_MUTATIONS = {
  /**
   * Pause a subscription
   */
  pauseSubscription: function (
    subscriptionId: string,
    requestBody: PauseSubscription
  ) {
    return paddle.subscriptions.pause(subscriptionId, requestBody);
  },
  /**
   * Update a subscription
   */
  updateSubscription: function (
    subscriptionId: string,
    requestBody: UpdateSubscriptionRequestBody
  ) {
    return paddle.subscriptions.update(subscriptionId, requestBody);
  },
  /**
   * Cancel a subscription
   */
  cancelSubscription: function (
    subscriptionId: string,
    requestBody: CancelSubscription
  ) {
    return paddle.subscriptions.cancel(subscriptionId, requestBody);
  },
  /**
   * Resume a subscription
   */
  resumeSubscription: function (
    subscriptionId: string,
    requestBody: ResumeSubscription
  ) {
    return paddle.subscriptions.resume(subscriptionId, requestBody);
  },
};
