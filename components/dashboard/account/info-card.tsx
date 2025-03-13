import { UserProfile } from "@clerk/nextjs";

export const AccountInfoCard = () => (
  <UserProfile
    path="/dashboard/account"
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
