import { UserProfile } from "@clerk/nextjs";

export const ProfileCard = () => (
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
