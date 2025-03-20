"use client";

import { authClient, signOut } from "@/auth/client";
import { Session } from "@/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  ArrowRight,
  ArrowUpFromLine,
  BadgeAlert,
  BadgeCheck,
  Laptop,
  Loader2,
  LogOut,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, use, useState } from "react";
import { UAParser } from "ua-parser-js";
import { Badge } from "@/components/ui/badge";
import { EditUserButton } from "./edit-user-button";
import { ChangePasswordButton } from "./change-password-button";
import Link from "next/link";
import { EmailVerificationAlert } from "./email-verification-alert";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

type ProfileCardProps = {
  profileSessionsPromise: Promise<[Session | null, Session["session"][]]>;
};

export const ProfileCard = ({ profileSessionsPromise }: ProfileCardProps) => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ProfileCardSuspense profileSessionsPromise={profileSessionsPromise} />
    </Suspense>
  );
};

const ProfileCardSuspense = ({ profileSessionsPromise }: ProfileCardProps) => {
  const [isTerminating, setIsTerminating] = useState<string>();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  const router = useRouter();
  const [sessionWithUser, activeSessions] = use(profileSessionsPromise);

  const trpc = useTRPC();
  const { data: activeSubscription } = useSuspenseQuery(
    trpc.subscriptions.getActive.queryOptions()
  );

  if (!sessionWithUser || !activeSessions) {
    return <div>No session found</div>;
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
            <EditUserButton />
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

        {/* Active Sessions [FIXME] */}
        <div className="border-l-2 px-2 w-max gap-1 flex flex-col">
          <p className="text-xs font-medium ">Active Sessions</p>
          {activeSessions
            .filter((session) => session.userAgent)
            .map((session) => {
              return (
                <div key={session.id}>
                  <div className="flex items-center gap-2 text-sm  text-black font-medium dark:text-white">
                    {new UAParser(session.userAgent || "").getDevice().type ===
                    "mobile" ? (
                      <Smartphone size={16} />
                    ) : (
                      <Laptop size={16} />
                    )}
                    {new UAParser(session.userAgent || "").getOS().name},{" "}
                    {new UAParser(session.userAgent || "").getBrowser().name}
                    <button
                      className="text-red-500 opacity-80  cursor-pointer text-xs border-muted-foreground underline "
                      onClick={async () => {
                        setIsTerminating(session.id);
                        const res = await authClient.revokeSession({
                          token: session.token,
                        });

                        if (res.error) {
                          toast({
                            title: "Error",
                            variant: "destructive",
                            description: res.error.message,
                          });
                        } else {
                          toast({
                            title: "Success",
                            description: "Session terminated successfully",
                          });
                        }
                        router.refresh();
                        setIsTerminating(undefined);
                      }}
                    >
                      {isTerminating === session.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : session.id === currentSession.id ? (
                        "Sign Out"
                      ) : (
                        "Terminate"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-between items-center">
        <ChangePasswordButton />

        {/* Sign out */}
        <Button
          className="gap-2 z-10"
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
