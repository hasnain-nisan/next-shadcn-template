import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example: check for an auth cookie (replace "token" with your actual cookie/session name)
  const token = request.cookies.get("token")?.value;

  // 1️⃣ Redirect `/` to `/dashboard`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2️⃣ Protect all `/dashboard` routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Optional: remember where the user was trying to go
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue normally for all other routes
  return NextResponse.next();
}

// Apply middleware to `/` and all `/dashboard` routes
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
