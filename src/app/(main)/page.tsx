import { getSession } from "@/lib/database/getSession";

export default async function Home() {
  const session = await getSession();

  return (
    <>
      <div>Home</div>
      <div>{JSON.stringify(session)}</div>
    </>
  );
}
