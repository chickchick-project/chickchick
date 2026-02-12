import type { Metadata, Viewport } from "next";
import { auth } from "@/auth";
import Providers from "@/components/commons/Provider/TanstackProvider";
import { BodyWrapper } from "@/components/commons/wrapper/BodyWrapper";
import { NavBarWrapper } from "@/components/commons/navBar/Wrapper";
import LoginModalProvider from "@/components/modal/LoginModalProvider";
import GlobalStateSync from "@/components/commons/Provider/GlobalStateSync";
import RecentSyncManager from "@/components/commons/Provider/RecentSyncManager";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://chickchick-kohl.vercel.app/",
  ),
  title: {
    default: "ChickChick - 나만의 향수 컬렉션",
    template: "%s | ChickChick",
  },
  description:
    "당신의 향수 취향을 발견하고, 공유하세요. ChickChick에서 향수 리뷰, 추천, 커뮤니티를 경험하세요.",
  keywords: [
    "향수",
    "퍼퓸",
    "향수 추천",
    "향수 리뷰",
    "향수 커뮤니티",
    "fragrance",
    "perfume",
    "scent",
    "chickchick",
  ],
  authors: [{ name: "ChickChick Team" }],
  creator: "ChickChick",
  publisher: "ChickChick",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://chickchick-kohl.vercel.app/",
    title: "ChickChick - 나만의 향수 컬렉션",
    description:
      "당신의 향수 취향을 발견하고, 공유하세요. ChickChick에서 향수 리뷰, 추천, 커뮤니티를 경험하세요.",
    siteName: "ChickChick",
    images: [
      {
        url: "/images/LogoForShare.png",
        width: 1200,
        height: 630,
        alt: "ChickChick Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChickChick - 나만의 향수 컬렉션",
    description:
      "당신의 향수 취향을 발견하고, 공유하세요. ChickChick에서 향수 리뷰, 추천, 커뮤니티를 경험하세요.",
    images: ["/images/LogoForShare.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://chickchick-kohl.vercel.app/",
  },
  other: {
    "link-preconnect": "https://wvedpvxspndgyoisudyr.supabase.co",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <html lang="ko" className="h-dvh overflow-y-scroll">
      <body className="h-full">
        <Providers>
          <RecentSyncManager />
          <NavBarWrapper />
          <BodyWrapper>
            <GlobalStateSync isAuthenticated={isAuthenticated} />
            {children}
          </BodyWrapper>
          <LoginModalProvider />
        </Providers>
        <div id="modal"></div>
      </body>
    </html>
  );
}
