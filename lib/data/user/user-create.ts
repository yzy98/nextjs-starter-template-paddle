import prisma from "@/lib/db";

interface userCreateProps {
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  clerk_id: string;
}

export const userCreate = async ({
  email,
  first_name,
  last_name,
  profile_image_url,
  clerk_id,
}: userCreateProps) => {
  try {
    await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        profile_image_url,
        clerk_id,
      },
    });
  } catch (error: any) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
};
