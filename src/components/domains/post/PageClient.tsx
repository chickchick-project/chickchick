"use client";

import PostForm, { TPostFormInitialData } from "./form";
import Header from "./header";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useCommunityPostForEdit } from "@/lib/hooks/query/useCommunityQuery";

interface IPostFormPageProps {
  type: "create" | "edit";
  postId?: string;
}

export default function PageClient({ type, postId }: IPostFormPageProps) {
  const { user, isLoading: isAuthLoading } = useUserStore();

  const { data: post, isError } = useCommunityPostForEdit(postId, type);

  if (isAuthLoading || !user) {
    return <div>로그인이 필요한 서비스 입니다.</div>;
  }

  if (isError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const initialData: TPostFormInitialData | undefined =
    type === "edit" && post
      ? {
          category: post.category,
          title: post.title,
          content: post.content,
          thumbnailUrl: post.thumbnailUrl,
          contentText: post.contentText,
          perfumes: post.perfumes || [],
        }
      : undefined;

  return (
    <div className="px-4 w-full flex flex-col items-center gap-5 pb-[150px]">
      <Header type={type} />
      <PostForm type={type} initialData={initialData} postId={postId} />
    </div>
  );
}
