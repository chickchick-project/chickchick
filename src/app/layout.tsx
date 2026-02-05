import NavBarWrapper from "@/components/commons/navBar/Wrapper";
import "./globals.css";
import localFont from "next/font/local";
import { BodyWrapper } from "@/components/commons/wrapper/BodyWrapper";
import LoginModalProvider from "@/components/modal/LoginModalProvider";
import Providers from "@/components/commons/Provider/TanstackProvider";
import GlobalStateSync from "@/components/commons/Provider/GlobalStateSync";
import RecentSyncManager from "@/components/commons/Provider/RecentSyncManager";
import { auth } from "@/auth";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <html lang="kr" className="h-dvh overflow-y-scroll">
      <body className={`${pretendard.variable} font-pretendard h-full`}>
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
