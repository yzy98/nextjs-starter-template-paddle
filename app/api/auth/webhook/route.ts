import { WebhookEvent } from "@clerk/nextjs/server";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { userCreate } from "@/lib/data/user/user-create";
import { userUpdate } from "@/lib/data/user/user-update";
import { userDelete } from "@/lib/data/user/user-delete";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get event type
  const eventType = evt.type;

  // Handle the event
  switch (eventType) {
    case "user.created":
      try {
        await userCreate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          clerk_id: payload?.data?.id,
        });

        console.log("User created:", payload?.data);
        return NextResponse.json({
          status: 200,
          message: "User info inserted",
        });
      } catch (error: any) {
        console.error("Error creating user:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    case "user.updated":
      try {
        await userUpdate({
          email: payload?.data?.email_addresses?.[0]?.email_address,
          first_name: payload?.data?.first_name,
          last_name: payload?.data?.last_name,
          profile_image_url: payload?.data?.profile_image_url,
          clerk_id: payload?.data?.id,
        });

        console.log("User updated:", payload?.data);
        return NextResponse.json({
          status: 200,
          message: "User info updated",
        });
      } catch (error: any) {
        console.error("Error updating user:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    case "user.deleted":
      try {
        await userDelete({
          clerk_id: payload?.data?.id,
        });
      } catch (error: any) {
        console.error("Error deleting user:", error);
        return NextResponse.json({
          status: 400,
          message: error.message,
        });
      }

    default:
      return new Response("Error occured -- unhandeled event type", {
        status: 400,
      });
  }
}
