import { useRef, useCallback } from "react";
import { UseFormGetValues } from "react-hook-form";
import { CreatePostClientInput } from "@/components/domains/post/form/postSchema";
import { PostDraftInput } from "@/lib/types/postDraft";
import { saveDraft as saveDraftApi, isDraftValid } from "@/lib/utils/postDraft";
import { DraftType } from "@prisma/client";

interface UsePostAutosaveOptions {
  getValues: UseFormGetValues<CreatePostClientInput>;
  type: "create" | "edit";
  postId?: string;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

export function usePostAutosave({
  getValues,
  type,
  postId,
  onSaveSuccess,
  onSaveError,
}: UsePostAutosaveOptions) {
  const isSavingRef = useRef(false);

  const saveDraft = useCallback(async () => {
    if (isSavingRef.current) return;

    const currentValues = getValues();

    const draft: PostDraftInput = {
      type: type === "edit" ? DraftType.UPDATE : DraftType.CREATE,
      category: currentValues.category,
      title: currentValues.title,
      content: currentValues.content,
      contentText: currentValues.contentText,
      thumbnailUrl: currentValues.thumbnailUrl,
      perfumeIds: currentValues.perfumeIds,
      postId: type === "edit" ? postId : undefined,
    };

    if (!isDraftValid(draft)) {
      onSaveError?.(new Error("Draft is not valid"));
      return;
    }

    try {
      isSavingRef.current = true;
      await saveDraftApi(draft);
      onSaveSuccess?.();
    } catch (error) {
      console.error("Draft save error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "임시 저장에 실패했습니다.";
      onSaveError?.(new Error(errorMessage));
    } finally {
      isSavingRef.current = false;
    }
  }, [getValues, type, postId, onSaveSuccess, onSaveError]);

  return {
    saveDraft,
    isSaving: isSavingRef.current,
  };
}
