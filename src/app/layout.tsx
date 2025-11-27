import NavBarWrapper from "@/components/commons/navBar/Wrapper";
import "./globals.css";
import localFont from "next/font/local";
import { BodyWrapper } from "@/components/commons/wrapper/BodyWrapper";
import LoginModalProvider from "@/components/modal/LoginModalProvider";
import Providers from "@/components/commons/Provider/TanstackProvider";
import GlobalStateSync from "@/components/commons/Provider/GlobalStateSync";
import RecentSyncManager from "@/components/commons/Provider/RecentSyncManager";
import KakaoScript from "@/lib/script/KakaoScript";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr" className="h-dvh overflow-y-scroll">
      <body className={`${pretendard.variable} font-pretendard h-full`}>
        <Providers>
          <RecentSyncManager />
          <NavBarWrapper />
          <BodyWrapper>
            <GlobalStateSync />
            {children}
          </BodyWrapper>
          <LoginModalProvider />
        </Providers>
        <div id="modal"></div>
        <KakaoScript />
      </body>
    </html>
  );
}
