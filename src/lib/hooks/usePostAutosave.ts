import { useRef, useCallback } from "react";
import { UseFormGetValues } from "react-hook-form";
import { CreatePostClientInput } from "@/components/domains/post/form/postSchema";
import { PostDraftInput } from "@/lib/types/postDraft";
import { saveDraftMock, isDraftValid } from "@/lib/utils/postDraft";

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
      await saveDraftMock(draft);
      onSaveSuccess?.();
    } catch (error) {
      onSaveError?.(error as Error);
    } finally {
      isSavingRef.current = false;
    }
  }, [getValues, type, postId, onSaveSuccess, onSaveError]);

  return {
    saveDraft,
    isSaving: isSavingRef.current,
  };
}
