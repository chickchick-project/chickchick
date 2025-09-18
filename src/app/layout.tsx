import NavBarWrapper from "@/components/commons/navBar/Wrapper";
import "./globals.css";
import localFont from "next/font/local";
import { BodyWrapper } from "@/components/commons/bodyWrapper/BodyWrapper";
import LoginModalProvider from "@/components/modal/LoginModalProvider";

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
        <NavBarWrapper />
        <BodyWrapper>{children}</BodyWrapper>
        <LoginModalProvider />
        <div id="modal"></div>
      </body>
    </html>
  );
}
