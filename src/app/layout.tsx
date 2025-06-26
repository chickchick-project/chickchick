import NavBarWrapper from "@/components/commons/navBar/Wrapper";
import "./globals.css";
import localFont from "next/font/local";
import { BodyWrapper } from "@/components/commons/bodyWrapper/BodyWrapper";

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
    <html lang="kr" className="h-dvh">
      <body className={`${pretendard.variable} font-pretendard h-full`}>
        <NavBarWrapper />
        <BodyWrapper>{children}</BodyWrapper>
        <div id="modal"></div>
      </body>
    </html>
  );
}
