"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function MobileNavbar() {
  const { isSignedIn } = useAuth();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="px-4 pt-4">
            <VisuallyHidden asChild>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <VisuallyHidden asChild>
              <SheetDescription>
                Access all pages and account settings
              </SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          <div className="flex flex-col p-4">
            <div className="mb-8">
              <SheetClose asChild>
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/images/youtube-comments-like-chat-logo-black.png"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                  <span className="font-semibold text-xl">
                    Youtube Comments Chat
                  </span>
                </Link>
              </SheetClose>
            </div>

            <div className="flex flex-col space-y-4">
              <SheetClose asChild>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
              </SheetClose>
              {isSignedIn && (
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Dashboard
                  </Link>
                </SheetClose>
              )}
              {!isSignedIn ? (
                <SheetClose asChild>
                  <Link
                    href="/sign-in"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Sign In
                  </Link>
                </SheetClose>
              ) : (
                <div className="pt-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
