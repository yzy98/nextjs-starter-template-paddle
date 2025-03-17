import Image from "next/image";
import Link from "next/link";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import { MobileNavbar } from "./mobile-navbar";
import { ModeToggle } from "./mode-toggle";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 border-b z-50 bg-background/95 backdrop-blur-xs">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
              <span className="font-semibold text-xl text-foreground">
                NextJS Starter Template Paddle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </SignedIn>
            <ModeToggle />
            <SignedOut>
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                userProfileMode="navigation"
                userProfileUrl="/dashboard/profile"
              />
            </SignedIn>
          </div>

          {/* Mobile Navigation */}
          <MobileNavbar />
        </div>
      </div>
    </nav>
  );
}
