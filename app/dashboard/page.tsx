import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerk_id: userId,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          Welcome to your dashboard! This is where you'll be able to manage your
          YouTube comments and chat settings.
        </p>
      </div>
      {JSON.stringify(user)}
    </div>
  );
}
