import { BrandLogo } from "@/components/ui/BrandLogo";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <BrandLogo
          label="Transparent Partner"
          iconSize={20}
          containerSize={32}
          className="text-foreground"
        />
        <nav className="flex gap-4">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium hover:underline underline-offset-4 text-muted-foreground hover:text-foreground"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Transparent Partner
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Build scalable apps with modern UI and backend architecture. Start by
          logging in or creating an account.
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          >
            Sign Up
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
