"use client";

import { Suspense, use, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpFromLine,
  BadgeAlert,
  BadgeCheck,
  Loader2,
  LogOut,
} from "lucide-react";

import { signOut } from "@/auth/client";
import { Session } from "@/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTRPC } from "@/trpc/client";

import { ActiveSessions } from "./active-sessions";
import { EmailVerificationAlert } from "./email-verification-alert";
import { ProfileActions } from "./profile-actions";

type ProfileCardProps = {
  profileSessionsPromise: Promise<[Session | null, Session["session"][]]>;
};

export const ProfileCard = ({ profileSessionsPromise }: ProfileCardProps) => {
  return (
    <Suspense fallback={<ProfileCardSkeleton />}>
      <ProfileCardSuspense profileSessionsPromise={profileSessionsPromise} />
    </Suspense>
  );
};

const ProfileCardSuspense = ({ profileSessionsPromise }: ProfileCardProps) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const router = useRouter();
  const [sessionWithUser, activeSessions] = use(profileSessionsPromise);

  const trpc = useTRPC();
  const { data: activeSubscription } = useSuspenseQuery(
    trpc.subscriptions.getActive.queryOptions()
  );

  if (!sessionWithUser || !activeSessions) {
    router.push("/");
    return;
  }

  const { user, session: currentSession } = sessionWithUser;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 grid-cols-1">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="size-9">
                <AvatarImage
                  src={user.image || undefined}
                  alt="Avatar"
                  className="object-cover"
                />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  {/* email verified tag */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        {user.emailVerified ? (
                          <BadgeCheck className="size-4 text-chart-2" />
                        ) : (
                          <BadgeAlert className="size-4 text-muted-foreground" />
                        )}
                      </TooltipTrigger>
                      <TooltipContent
                        className="text-xs px-2 py-1"
                        sideOffset={-2}
                      >
                        {user.emailVerified ? (
                          <p>Email verified</p>
                        ) : (
                          <p>Email not verified</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
            <ProfileActions />
          </div>

          {/* Subscription badge */}
          <div className="flex items-center justify-between">
            {activeSubscription ? (
              <>
                <Badge
                  variant="premium"
                  className="px-3 py-1 text-xs font-semibold"
                >
                  Premium
                </Badge>
                <Button asChild size="sm">
                  <Link href="/dashboard/subscriptions">
                    <ArrowRight size={16} />
                    Manage Subscription
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-xs font-semibold"
                >
                  Free
                </Badge>
                <Button asChild size="sm">
                  <Link href="/pricing">
                    <ArrowUpFromLine size={16} />
                    Upgrade Plan
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Email verification [FIXME] email sent state not working */}
        {!user.emailVerified && <EmailVerificationAlert email={user.email} />}

        {/* Active Sessions */}
        <ActiveSessions
          activeSessions={activeSessions}
          currentSession={currentSession}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          className="gap-2 cursor-pointer"
          size="sm"
          variant="secondary"
          disabled={isSigningOut}
          onClick={async () => {
            setIsSigningOut(true);
            await signOut({
              fetchOptions: {
                onSuccess() {
                  router.push("/");
                },
              },
            });
            setIsSigningOut(false);
          }}
        >
          <span className="text-sm">
            {isSigningOut ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <LogOut size={16} />
                Sign Out
              </div>
            )}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const ProfileCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 grid-cols-1">
        {/* User info skeleton */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar skeleton */}
              <Skeleton className="size-9 rounded-full" />
              <div className="grid">
                {/* Username skeleton */}
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="size-4 rounded-full" />
                </div>
                {/* Email skeleton */}
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
            </div>
            {/* Edit button skeleton */}
            <Skeleton className="size-8" />
          </div>

          {/* Subscription info skeleton */}
          <div className="flex items-center justify-between mt-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-8 w-32" />
          </div>
        </div>

        {/* Email verification skeleton */}
        <Skeleton className="h-20 w-full" />

        {/* Active sessions skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        {/* Sign out button skeleton */}
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
};
