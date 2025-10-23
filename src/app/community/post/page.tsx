import PageClient from "@/components/domains/post/PageClient";
import { getSession } from "@/lib/database/getSession";
export default async function Page() {
  const session = await getSession();

  if (!session) {
    return <div>로그인이 필요한 서비스 입니다.</div>; //로그인 하지 않은경우 로그인 모달띄우기
  }

  return (
    <>
      <PageClient type="create" />
    </>
  );
}
