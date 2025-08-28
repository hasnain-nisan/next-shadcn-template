import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 text-center gap-10">
      <Image
        src="/unauthorized.svg" // Replace with your own illustration
        alt="Unauthorized Access"
        width={240}
        height={240}
        className="dark:invert"
        priority
      />

      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          You don’t have permission to view this page. If you think this is a
          mistake, please contact your administrator.
        </p>
      </div>

      <Button type="button" asChild className="w-full max-w-xs">
        <Link href="/dashboard">Return to Dashboard</Link>
      </Button>

      <div className="text-muted-foreground text-xs text-center text-balance max-w-sm">
        Need help?{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Contact support
        </Link>
        .
      </div>
    </div>
  );
}
