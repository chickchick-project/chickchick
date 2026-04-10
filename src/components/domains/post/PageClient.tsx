"use client";

import { useCommunityPostForEdit } from "@/client/hooks/query/useCommunityQuery";
import { useCurrentUser } from "@/components/commons/Provider/CurrentUserProvider";
import { useDraft, useDraftByPostId } from "@/client/hooks/query/useDraftQuery";
import { usePerfumeDetail } from "@/client/hooks/query/usePerfumeQuery";
import { useSearchParams } from "next/navigation";
import type { PerfumeForPost } from "@/server/hono/schemas/community.schema";

import PostForm, { PostFormInitialData } from "./form";
import Header from "./header";

interface PostFormPageProps {
  type: "create" | "edit";
  postId?: string;
}

export default function PageClient({ type, postId }: PostFormPageProps) {
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");
  const skipDraftCheck = searchParams.get("skipDraftCheck") === "true";
  const perfumeId = searchParams.get("perfumeId");

  const { data: post, isError } = useCommunityPostForEdit(postId, type);
  const { data: prefilledPerfume } = usePerfumeDetail(perfumeId ?? "");

  // 수정 모드일 때 해당 postId의 UPDATE draft 조회
  // skipDraftCheck가 true면 draft 조회 비활성화 (삭제 후 바로 수정하는 경우)
  const { data: updateDraft, isLoading: isUpdateDraftLoading } =
    useDraftByPostId(postId || "", type === "edit" && !skipDraftCheck);

  // draftId가 명시적으로 전달된 경우 (복원 시)
  const { data: explicitDraft, isLoading: isExplicitDraftLoading } = useDraft(
    draftId || "",
  );

  // 디버깅 로그
  console.log("[PageClient] 렌더링", {
    type,
    postId,
    draftId,
    skipDraftCheck,
    updateDraft: updateDraft
      ? `존재 (id: ${updateDraft.id}, postId: ${updateDraft.postId})`
      : "없음",
    explicitDraft: explicitDraft
      ? `존재 (id: ${explicitDraft.id}, postId: ${explicitDraft.postId})`
      : "없음",
    isUpdateDraftLoading,
    isExplicitDraftLoading,
  });

  if (isAuthLoading || !user) {
    return <div>로그인이 필요한 서비스 입니다.</div>;
  }

  // 로딩 상태 처리
  if (type === "edit" && isUpdateDraftLoading) {
    return <div>임시 저장 데이터를 확인하는 중...</div>;
  }

  if (draftId && isExplicitDraftLoading) {
    return <div>임시 저장 데이터를 불러오는 중...</div>;
  }

  if (isError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  // 우선순위: explicitDraft > updateDraft > post > undefined
  // explicitDraft: 모달에서 "복원하기" 선택 시
  // updateDraft: 수정 모드에서 자동으로 조회된 draft
  const draft = explicitDraft || (type === "edit" ? updateDraft : null);

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

  const initialPerfumes: PerfumeForPost[] | undefined =
    type === "create" && !draft && prefilledPerfume
      ? [
          {
            id: prefilledPerfume.id,
            nameEn: prefilledPerfume.nameEn,
            nameKo: prefilledPerfume.nameKo,
            brand: prefilledPerfume.brand,
            perfumeImage: prefilledPerfume.perfumeImage ?? null,
          },
        ]
      : undefined;

  return (
    <div className="px-4 w-full flex flex-col items-center gap-5 pb-[150px]">
      <Header type={type} />
      <PostForm
        type={type}
        initialData={initialData}
        initialPerfumes={initialPerfumes}
        postId={postId}
        draftId={draft?.id}
      />
    </div>
  );
}
