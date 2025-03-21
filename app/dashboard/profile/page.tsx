import { ProfileCard } from "@/components/dashboard/profile/card";

import { getProfileSessions } from "./actions";

export default function ProfilePage() {
  const profileSessionsPromise = getProfileSessions();

  return <ProfileCard profileSessionsPromise={profileSessionsPromise} />;
}
