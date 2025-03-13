import NavBarWrapper from "@/components/commons/navBar/Wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBarWrapper />
      {children}
    </>
  );
}
