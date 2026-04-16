import NextAuth from "next-auth";
import { NextResponse } from "next/server";
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

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true;
  return PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const isPublic = isPublicRoute(pathname);

  // 세션 쿠키가 존재하지만 파싱에 실패한 경우(손상된 토큰, 잘못된 시크릿 등)
  // req.auth가 null이지만 쿠키가 남아있는 상태 → 쿠키를 지워서 초기화
  const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
    req.cookies.has(name),
  );

  if (!isAuthenticated && hasSessionCookie) {
    if (!isPublic) {
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
      const redirect = NextResponse.redirect(url);
      for (const name of SESSION_COOKIE_NAMES) {
        redirect.cookies.delete(name);
      }
      return redirect;
    }

    // 퍼블릭 라우트인 경우 리디렉트 없이 쿠키만 초기화
    const next = NextResponse.next();
    for (const name of SESSION_COOKIE_NAMES) {
      next.cookies.delete(name);
    }
    return next;
  }

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
