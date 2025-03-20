import Image from "next/image";
import Link from "next/link";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu, LogIn, Home, CreditCard, LayoutDashboard } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { ModeToggle } from "./mode-toggle";

export function MobileNavbar() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Menu size={24} />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-background/95 backdrop-blur-xs flex flex-col"
        >
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

          <div className="flex flex-col p-4 flex-1">
            <div className="mb-8">
              <SheetClose asChild>
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                  <span className="font-semibold text-xl text-foreground">
                    NextJS Starter Template Paddle
                  </span>
                </Link>
              </SheetClose>
            </div>

            <div className="flex flex-col space-y-4">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-8 w-8 p-1" />
                  <span>Home</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/pricing"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CreditCard className="h-8 w-8 p-1" />
                  <span>Pricing</span>
                </Link>
              </SheetClose>
              {/* <SignedIn>
                <SheetClose asChild>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LayoutDashboard className="h-8 w-8 p-1" />
                    <span>Dashboard</span>
                  </Link>
                </SheetClose>
              </SignedIn>
              <SignedOut>
                <SheetClose>
                  <SignInButton>
                    <div className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <LogIn className="h-8 w-8 p-1" />
                      <span>Sign In</span>
                    </div>
                  </SignInButton>
                </SheetClose>
              </SignedOut> */}
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
