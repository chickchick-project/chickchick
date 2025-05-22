export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-[1200px] mx-auto my-10">{children}</div>;
}
