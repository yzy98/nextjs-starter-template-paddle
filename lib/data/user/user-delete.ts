import prisma from "@/lib/db";

export const userDelete = async ({ clerk_id }: { clerk_id: string }) => {
  try {
    await prisma.user.delete({
      where: {
        clerk_id,
      },
    });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(error.message);
  }
};
