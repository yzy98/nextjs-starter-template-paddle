import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t py-6 mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms-of-use" className="hover:underline">
            Terms of Use
          </Link>
        </nav>
      </div>
    </footer>
  );
}
