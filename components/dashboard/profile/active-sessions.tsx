"use client";

import { authClient } from "@/auth/client";
import { Loader2 } from "lucide-react";
import { Session } from "@/auth/types";
import { useToast } from "@/hooks/use-toast";
import { Laptop } from "lucide-react";
import { Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UAParser } from "ua-parser-js";

interface ActiveSessionsProps {
  activeSessions: Session["session"][];
  currentSession: Session["session"];
}

export const ActiveSessions = ({
  activeSessions,
  currentSession,
}: ActiveSessionsProps) => {
  const [isTerminating, setIsTerminating] = useState<string>();
  const { toast } = useToast();
  const router = useRouter();

  return (
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
                  className="text-destructive/90 hover:text-destructive cursor-pointer text-xs underline"
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
  );
};
