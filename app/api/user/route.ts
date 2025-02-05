import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/db";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      clerk_id: userId,
    },
    include: {
      subscriptions: {
        include: {
          product: true,
          price: true,
        },
      },
    },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  return NextResponse.json(user);
}
