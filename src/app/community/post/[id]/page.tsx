import { auth } from "@/auth";
import { getPostDetailById } from "@/components/domains/postDetail/postDetail.helpers";
import PageClient from "@/components/domains/postDetail/PageClient";
import { getSession } from "@/lib/database/getSession";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const result = await getPostDetailById(id);

  if (!result.success || !result.data) {
    return (
      <div>게시글을 불러오는 데 실패했거나, 존재하지 않는 게시글입니다.</div>
    );
  }
  return (
    <>
      <PageClient postDetail={result.data} />
    </>
  );
}
