"use client";

import { UserProfile, useUser } from "@clerk/nextjs";

export const ProfileCard = () => {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  return (
    <UserProfile
      path="/dashboard/profile"
      routing="path"
      appearance={{
        elements: {
          navbar: "hidden!",
          navbarMobileMenuRow: "hidden!",
          cardBox: "rounded-lg! border! shadow-sm!",
          scrollBox: "bg-card!",
          actionCard: "bg-card!",
        },
      }}
    />
  );
};
