import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center gap-10">
      <Image
        src="/404.svg"
        alt="404 Illustration"
        width={240}
        height={240}
        className="dark:invert"
        priority
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground max-w-md">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>

      <Button type="button" asChild className="w-full max-w-xs">
        <Link href="/">Return to Homepage</Link>
      </Button>

      <div className="text-muted-foreground text-xs text-center text-balance max-w-sm">
        If you believe this is an error, please{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          contact support
        </Link>
        .
      </div>
    </div>
  );
}
