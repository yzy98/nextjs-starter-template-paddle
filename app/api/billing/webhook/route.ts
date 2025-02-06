import crypto from "crypto";

import { MUTATIONS } from "@/server/db/mutations";
import {
  isPaddleEvent,
  isPaddleSubscriptionEvent,
} from "@/server/paddle/typeguards";

async function isValidSignature(
  requestBody: string,
  secretKey: string,
  signature: string
): Promise<boolean> {
  const parts = signature.split(";");
  const signatureParts = Object.fromEntries(
    parts.map((part) => part.split("=")).filter(([_, value]) => value)
  );

  const { ts, h1 } = signatureParts;
  if (!ts || !h1) return false;

  const payloadWithTime = `${ts}:${requestBody}`;
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(payloadWithTime)
    .digest("hex");

  return computedHash === h1;
}

export async function POST(request: Request) {
  try {
    const signature = request.headers.get("paddle-signature");
    const rawRequestBody = await request.text();
    const privateKey = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET;

    if (!signature || !rawRequestBody || !privateKey) {
      return Response.json(
        {
          status: 400,
          message: "Missing required parameters",
        },
        { status: 400 }
      );
    }

    const isValid = await isValidSignature(
      rawRequestBody,
      privateKey,
      signature
    );
    if (!isValid) {
      return Response.json(
        {
          status: 401,
          message: "Invalid signature",
        },
        { status: 401 }
      );
    }

    const eventData = JSON.parse(rawRequestBody);

    console.log("eventData", eventData);
    if (!isPaddleEvent(eventData)) {
      return Response.json(
        {
          status: 400,
          message: "Invalid event format",
        },
        { status: 400 }
      );
    }

    if (isPaddleSubscriptionEvent(eventData)) {
      switch (eventData.event_type) {
        case "subscription.created":
          await MUTATIONS.createSubscription(eventData);
          break;
        case "subscription.updated":
          await MUTATIONS.updateSubscription(eventData);
          break;
        case "subscription.canceled":
          await MUTATIONS.cancelSubscription(eventData);
          break;
        default:
          return Response.json(
            {
              status: 400,
              message: "Unhandled event type",
            },
            { status: 400 }
          );
      }
    }

    return Response.json(
      {
        status: 200,
        message: "Event processed",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return Response.json(
      {
        status: 500,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
