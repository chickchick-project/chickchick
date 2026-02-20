import { PostDraftInput, SaveDraftResponse } from "@/lib/types/postDraft";

/**
 * Mock 함수: Draft 저장 시뮬레이션
 *
 * 향후 API 엔드포인트: POST /api/drafts
 * - 요청 body: CreateDraftBody (draft.schema.ts 참조)
 * - 응답: SaveDraftResponse
 */
export async function saveDraftMock(
  draft: PostDraftInput,
): Promise<SaveDraftResponse> {
  // 백엔드 API로 전송될 정확한 JSON 구조
  const apiPayload = {
    category: draft.category,
    title: draft.title,
    content: draft.content,
    contentText: draft.contentText,
    thumbnailUrl: draft.thumbnailUrl,
    perfumeIds: draft.perfumeIds || [],
    postId: draft.postId,
  };

  console.log("💾 Draft API Payload:", JSON.stringify(apiPayload, null, 2));

  // API 응답 시뮬레이션
  return {
    success: true,
    message: "Draft saved successfully",
    draft: {
      id: "mock-draft-id",
      userId: "mock-user-id",
      title: draft.title,
      content: draft.content,
      contentText: draft.contentText,
      category: draft.category === "" ? "FREEBOARD" : draft.category,
      thumbnailUrl: draft.thumbnailUrl,
      perfumeIds: draft.perfumeIds || [],
      postId: draft.postId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
}

/**
 * Draft가 유효한 내용을 포함하는지 검증
 * 빈 draft는 저장하지 않도록 필터링
 */
export function isDraftValid(draft: Partial<PostDraftInput>): boolean {
  const hasTitle = draft.title && draft.title.trim().length > 0;
  const hasContent = draft.content && draft.content.trim().length > 0;
  const hasCategory = !!draft.category && String(draft.category) !== "";

  return !!(hasTitle || hasContent || hasCategory);
}
