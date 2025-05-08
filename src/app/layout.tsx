import NavBarWrapper from "@/components/commons/navBar/Wrapper";
import "./globals.css";
import localFont from "next/font/local";

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
    <html lang="kr">
      <body
        className={`${pretendard.variable} font-pretendard max-w-[1200px] mx-auto`}
      >
        <NavBarWrapper />
        {children}
        <div id="modal"></div>
      </body>
    </html>
  );
}
