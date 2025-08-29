import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const DEFAULT_REDIRECT_PATH = "/dashboard";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const now = Math.floor(Date.now() / 1000);
    const isExpired = !!token?.accessTokenExp && token.accessTokenExp < now;

    const routeAccessMap: { [key: string]: string } = {
      "/dashboard/users": "canManageUsers",
      "/dashboard/clients": "canManageClients",
      "/dashboard/projects": "canManageProjects",
      "/dashboard/discovery-interview": "canManageInterviews",
      "/dashboard/client-stakeholders": "canManageStakeholders",
    };

    // access scope check
    for (const route in routeAccessMap) {
      const requiredScope = routeAccessMap[route];

      if (pathname.startsWith(route)) {
        if (isExpired) {
          // Expired → send to login
          const url = req.nextUrl.clone();
          url.pathname = "/login";
          url.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(url);
        }

        if (!token?.accessScopes?.[requiredScope]) {
          // Not expired but missing scope → send to unauthorized
          const url = req.nextUrl.clone();
          url.pathname = "/unauthorized";
          url.searchParams.set("callbackUrl", pathname);
          return NextResponse.redirect(url);
        }
      }
    }

    // 1️⃣ Expired token → login (skip if already there)
    if (isExpired && !pathname.startsWith("/login")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // 2️⃣ Home route
    if (pathname === "/") {
      const url = req.nextUrl.clone();
      url.pathname = token && !isExpired ? DEFAULT_REDIRECT_PATH : "/login";
      return NextResponse.redirect(url);
    }

    // 3️⃣ Protect dashboard
    if ((!token || isExpired) && pathname.startsWith("/dashboard")) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // 4️⃣ Authenticated visiting login → dashboard
    if (token && !isExpired && pathname.startsWith("/login")) {
      const url = req.nextUrl.clone();
      url.pathname = DEFAULT_REDIRECT_PATH;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  },
  { callbacks: { authorized: () => true } }
);

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
