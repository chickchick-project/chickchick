import { cookies } from "next/headers";
import {
  getPostDetailById,
  getPostDetailStatusById,
} from "@/components/domains/postDetail/postDetail.helpers";
import PageClient from "@/components/domains/postDetail/PageClient";
import { getCommentsByPostId } from "@/components/domains/postDetail/commentSection/comment.helper";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();

  const requestHeaders = {
    Cookie: cookieStore.toString(),
  };

  try {
    const [postResult, postStatusResult, commentsResult] = await Promise.all([
      getPostDetailById(id, requestHeaders),
      getPostDetailStatusById(id, requestHeaders),
      getCommentsByPostId(id),
    ]);

    return (
      <>
        <PageClient
          postDetail={postResult.data}
          postStatus={postStatusResult.data}
          initialCommentsResult={commentsResult.data}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching post details:", error);
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        게시글을 불러오는 데 실패했거나, 존재하지 않는 게시글입니다.
      </div>
    );
  }
}
