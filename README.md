# My NextJs SAAS Starter Template

## . CSS: Tailwind

## . UI: Shadcn

## . Auth: Clerk

## . DB: Supabase

## . ORM: Prisma

## . Payments: Paddle

# Set ups

## . Next.js

Go yo your <TAGET_FOLDER>

```shell
cd <TAGET_FOLDER_NAME>
```

Create a new next.js app

```shell
npx create-next-app@latest
```

Add dependicies

```shell
pnpm i
```

test it

```shell
pnpm dev
```

DONE!

## . Clerk

install the Clerk SDK

```shell
pnpm add @clerk/nextjs
```

create an clerk application in Clerk Dashboard, and create an .env file under your prokect root path

```shell
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<XXXXXXXX>
CLERK_SECRET_KEY=<XXXXXXX>
```

Create middleware.ts under project root path

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && isProtectedRoute(req)) {
    // Add custom logic to run before redirecting
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

Refresh the localhost://3000 page, you should only see clerk sign in page!

## . Supabase

Create a new peoject in Supabase dashboard, copy the database password somewhere.

Go to project settings -> configuration -> Database-> copy the database Urls into .env

```shell
DATABASE_URL= # Set this to the Transaction connection pooler string you copied in Step 1
DIRECT_URL=  # Set this to the Session connection pooler string you copied in Step 1
```

## . Prisma

Set up the Prisma ORM

```shell
pnpm dlx prisma init
```

set up schema.prisma

```json
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Add User model

```json
model User {
  id                Int       @id @default(autoincrement())
  created_time      DateTime  @default(now())
  email             String   @unique
  first_name        String?
  last_name         String?
  gender            String?
  profile_image_url String?
  clerk_id          String   @unique
}
```

Run this command:

```shell
pnpm dlx prisma migrate dev --name init
```

This command did three things:

1. It created a new SQL migration file for this migration in the `prisma/migrations` directory.
2. It executed the SQL migration file against the database.
3. It ran `prisma generate` under the hood (which installed the `@prisma/client` package and generated a tailored Prisma Client API based on your models).

Refresh the supabase database table, you should see User and \_prisma_migrations tables!

# Auth Webhooks

## . Set up Clerk webhook

Using Ngrok to proxy localhost:3000 for development.

```shell
ngrok http http://localhost:3000
```

Copy the Forwarding host, go to Clerk project dashboard -> Configure -> Webhooks -> create endopint,

add URL, and tick events: user.created, user.deleted, user.updated

```shell
<YOUR_FORWARDING_HOST_URL>/api/auth/webhook
```

Copy Signing Scret into .env and name it

```.env
CLERK_WEBHOOK_SECRET=<SIGNING_SECRET>
```

install Svix package

```shell
pnpm add svix
```

Create app/api/auth/webhook/route.ts endpoint

```ts
import { WebhookEvent } from "@clerk/nextjs/server";

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { userCreate } from "@/lib/data/user/user-create";

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
      break;

    case "user.deleted":
      break;

    default:
      return new Response("Error occured -- unhandeled event type", {
        status: 400,
      });
  }
}
```

## . Instantiate a single instance `PrismaClient`

Create db.ts under @/lib folder

```ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
```

## . Update layout.tsx

```tsx
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

Sign up, check Clerk dashboard and Supabse User table, should create user successfully! Auth Webhook set up DONE!
