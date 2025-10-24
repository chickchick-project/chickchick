import PageWrapper from "@/components/commons/wrapper/PageWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageWrapper className="flex flex-col items-center">{children}</PageWrapper>
  );
}
