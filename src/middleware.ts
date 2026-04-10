import NextAuth from "next-auth";
import { authConfig } from "@/authConfig";

const { auth } = NextAuth(authConfig);

const PUBLIC_ROUTES = ["/", "/perfumes", "/community"];

const PUBLIC_ROUTE_PATTERNS = [
  /^\/perfumes\/[^/]+$/,
  /^\/brand\/[^/]+$/,
  /^\/community\/post\/[^/]+$/,
  /^\/user\/[^/]+$/,
  /^\/user\/[^/]+\/collection$/,
  /^\/user\/[^/]+\/bookmarks$/,
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isPublic = isPublicRoute(pathname);

  if (!isAuthenticated && !isPublic) {
    const url = req.nextUrl.clone();

    const originalUrl = req.nextUrl.search
      ? `${pathname}${req.nextUrl.search}`
      : pathname;

    if (pathname.startsWith("/community")) {
      url.pathname = "/community";
      const referer = req.headers.get("referer");
      if (referer) {
        const refererParams = new URL(referer).search;
        if (refererParams.startsWith("?")) {
          url.search = refererParams.substring(1);
        }
      }
    } else {
      url.pathname = "/";
      url.search = "";
    }

    url.searchParams.set("callbackUrl", originalUrl);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!api|_next|__nextjs|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)",
  ],
};
