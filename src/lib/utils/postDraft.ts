import { PostDraftInput, SaveDraftResponse } from "@/lib/types/postDraft";
import { draftApi } from "@/lib/utils/api/draft.api";
import { CreateDraftBody } from "@/lib/hono/schemas/draft.schema";

/**
 * Draft 저장 함수
 *
 * API 엔드포인트: POST /api/v1/drafts
 */
export async function saveDraft(
  draft: PostDraftInput,
): Promise<SaveDraftResponse> {
  const apiPayload: CreateDraftBody = {
    type: draft.type,
    category: draft.category === "" ? "FREEBOARD" : draft.category,
    title: draft.title,
    content: draft.content,
    contentText: draft.contentText,
    thumbnailUrl: draft.thumbnailUrl,
    perfumeIds: draft.perfumeIds || [],
    postId: draft.postId,
  };

  try {
    const response = await draftApi.create(apiPayload);

    if (!response) {
      throw new Error("No response from server");
    }

    return {
      success: response.success,
      message: response.message,
      draft: response.data,
    };
  } catch (error) {
    console.error("❌ Draft save failed:", error);
    throw error;
  }
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
