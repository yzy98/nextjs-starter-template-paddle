import prisma from "@/lib/db";

interface userUpdateProps {
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile_image_url: string | null;
  clerk_id: string;
}

export const userUpdate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  clerk_id,
}: userUpdateProps) => {
  try {
    await prisma.user.update({
      where: {
        clerk_id,
      },
      data: {
        email,
        first_name,
        last_name,
        profile_image_url,
        clerk_id,
      },
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(error.message);
  }
};
