import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 비로그인 상태에서도 접근 가능한 페이지 경로
const PUBLIC_ROUTES = ["/", "/perfumes", "/community"];

// 동적 경로 패턴 (비로그인 허용)
const PUBLIC_ROUTE_PATTERNS = [
  /^\/perfumes\/[^/]+$/, // /perfumes/:id
  /^\/brand\/[^/]+$/, // /brand/:name
  /^\/community\/post\/[^/]+$/, // /community/post/:id (게시글 읽기)
  /^\/user\/[^/]+$/, // /user/:id (프로필 보기)
  /^\/user\/[^/]+\/collection$/, // /user/:id/collection
  /^\/user\/[^/]+\/bookmarks$/, // /user/:id/bookmarks
];

/**
 * 주어진 경로가 비로그인 상태에서 접근 가능한지 확인
 */
function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true;
  }

  return PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트 제외
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Next.js 내부 경로 제외 (__nextjs 관련 모두 제외)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/__nextjs") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // 정적 파일 제외
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isPublic = isPublicRoute(pathname);

  // 개발 모드에서만 로깅 (production에서는 로깅 제거)
  if (process.env.NODE_ENV === "development") {
    console.log("🔐 [Middleware]", pathname, {
      session: !!sessionToken,
      public: isPublic,
    });
  }

  // 로그인 필요한 페이지에 비로그인 상태로 접근
  if (!sessionToken && !isPublic) {
    const url = request.nextUrl.clone();

    const originalUrl = request.nextUrl.search
      ? `${pathname}${request.nextUrl.search}`
      : pathname;

    const referer = request.headers.get("referer");
    let refererParams = "";
    if (referer) {
      const refererUrl = new URL(referer);
      refererParams = refererUrl.search;
    }

    if (pathname.startsWith("/community")) {
      url.pathname = "/community";
      if (refererParams && refererParams.startsWith("?")) {
        url.search = refererParams.substring(1);
      }
    } else {
      url.pathname = "/";
      url.search = "";
    }

    url.searchParams.set("callbackUrl", originalUrl);

    if (process.env.NODE_ENV === "development") {
      console.log("🚫 [Middleware] REDIRECT:", originalUrl, "→", url.pathname);
    }

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next (Next.js internals)
     * - __nextjs (Next.js dev tools)
     * - static files (images, fonts, etc.)
     */
    "/((?!api|_next|__nextjs|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)).*)",
  ],
};
