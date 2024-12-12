import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  if (!user) {
    redirect("/");
  }

  return <div className="bg-purple-500">{JSON.stringify(user)}</div>;
}
