"use client";

import { useCommunityPostForEdit } from "@/lib/hooks/query/useCommunityQuery";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useDraft } from "@/lib/hooks/query/useDraftQuery";
import { useSearchParams } from "next/navigation";

import PostForm, { PostFormInitialData } from "./form";
import Header from "./header";

interface PostFormPageProps {
  type: "create" | "edit";
  postId?: string;
}

export default function PageClient({ type, postId }: PostFormPageProps) {
  const { user, isLoading: isAuthLoading } = useUserStore();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");

  const { data: post, isError } = useCommunityPostForEdit(postId, type);
  const { data: draft, isLoading: isDraftLoading } = useDraft(draftId || "");

  if (isAuthLoading || !user) {
    return <div>로그인이 필요한 서비스 입니다.</div>;
  }

  if (draftId && isDraftLoading) {
    return <div>임시 저장 데이터를 불러오는 중...</div>;
  }

  if (isError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const initialData: PostFormInitialData | undefined = draft
    ? {
        category: draft.category,
        title: draft.title,
        content: draft.content,
        thumbnailUrl: draft.thumbnailUrl,
        contentText: draft.contentText,
        perfumeIds: draft.perfumeIds,
        perfumes: draft.perfumes || [], // Draft에서 저장된 향수 정보 사용
      }
    : type === "edit" && post
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
      <PostForm
        type={type}
        initialData={initialData}
        postId={postId}
        draftId={draftId || undefined}
      />
    </div>
  );
}
