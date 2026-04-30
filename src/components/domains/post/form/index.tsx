"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { PostCategory as TPostCategory } from "@/server/hono/schemas/community.schema";

import type { BlobRegistry } from "@/client/tiptap/blobRegistry";
import { finalizeContentWithBlobUpload } from "@/client/tiptap/blobRegistry";
import type { PerfumeForPost } from "@/server/hono/schemas/community.schema";

import {
  CreatePostClientSchema,
  type CreatePostClientInput,
} from "./postSchema";
import { usePostMutation } from "@/client/hooks/query/useCommunityQuery";
import { extractFirstImageSrc } from "@/shared/utils/extractFirstImageSrc";
import getPlainText from "@/shared/utils/getPlainText";
import { usePostAutosave } from "@/client/hooks/usePostAutosave";
import { useBeforeUnload } from "@/client/hooks/useBeforeUnload";
import { useDeleteDraft } from "@/client/hooks/query/useDraftQuery";

import PostCategory from "./PostCategory";
import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostTitle from "./PostTitle";
import PostRelatedPerfume from "./postRelatedPerfume/PostRelatedPerfume";

export type PostFormInitialData = CreatePostClientInput & {
  perfumes: PerfumeForPost[] | [];
};

interface PostFormProps {
  type: "create" | "edit";
  initialData?: PostFormInitialData;
  initialPerfumes?: PerfumeForPost[];
  postId?: string;
  draftId?: string;
}

export default function PostForm({
  type,
  initialData,
  initialPerfumes,
  postId,
  draftId,
}: PostFormProps) {
  const blobRegistryRef = useRef<BlobRegistry>(new Map<string, File>());

  const method = useForm<CreatePostClientInput>({
    resolver: zodResolver(CreatePostClientSchema),
    mode: "onChange",
    defaultValues: {
      category: initialData?.category ?? ("" as unknown as TPostCategory),
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      contentText: initialData?.contentText ?? "",
      thumbnailUrl: initialData?.thumbnailUrl ?? null,
      perfumeIds: initialData?.perfumeIds ?? [],
      perfumes: initialData?.perfumes ?? [],
    },
  });

  const { handleSubmit, formState, setValue, getValues, reset } = method;

  const { isDirty } = formState;

  const { createMutation, editMutation } = usePostMutation(postId);
  const deleteDraftMutation = useDeleteDraft();
  const isLoading = createMutation.isPending || editMutation.isPending;

  // 임시 저장 상태 관리
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  // 수동 저장 훅
  const { saveDraft } = usePostAutosave({
    getValues,
    type,
    postId,
    onSaveSuccess: () => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    },
    onSaveError: (error) => {
      console.error("Save error:", error);
      setSaveStatus("idle");
    },
  });

  // 수동 저장 핸들러
  const handleManualSave = useCallback(async () => {
    setSaveStatus("saving");
    await saveDraft();
  }, [saveDraft]);

  useBeforeUnload({
    enabled: isDirty,
  });

  // Draft 데이터가 로드되면 폼 필드를 초기화
  useEffect(() => {
    if (initialData) {
      reset({
        category: initialData.category,
        title: initialData.title,
        content: initialData.content,
        contentText: initialData.contentText,
        thumbnailUrl: initialData.thumbnailUrl,
        perfumeIds: initialData.perfumeIds ?? [],
        perfumes: initialData.perfumes ?? [],
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CreatePostClientInput) => {
    const finalizedContent = await finalizeContentWithBlobUpload(
      data.content,
      blobRegistryRef.current,
    );
    setValue("content", finalizedContent, { shouldDirty: true });
    const thumbnailUrl = extractFirstImageSrc(finalizedContent);
    const contentText = getPlainText(finalizedContent);
    const postData: CreatePostClientInput = {
      ...data,
      content: finalizedContent,
      thumbnailUrl,
      contentText,
    };

    // 게시글 제출 전에 임시 저장 삭제
    if (draftId) {
      try {
        await deleteDraftMutation.mutateAsync(draftId);
      } catch (error) {
        console.error("Failed to delete draft:", error);
        // 임시 저장 삭제 실패해도 게시글은 제출
      }
    }

    if (type === "create") {
      createMutation.mutate(postData);
    } else if (type === "edit") {
      editMutation.mutate(postData);
    }
  };

  return (
    <FormProvider {...method}>
      <form
        className="w-full flex flex-col items-center gap-14"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full grid grid-cols-1 tablet:grid-cols-[85px_1fr] tablet:gap-x-[30px] pc:gap-x-[200px] gap-y-2 tablet:gap-y-14">
          <PostCategory />
          <PostTitle />
          <PostEditor blobRegistryRef={blobRegistryRef} />
          <PostRelatedPerfume initialPerfumes={initialData?.perfumes ?? initialPerfumes} />
        </div>
        <PostFormActions
          disabled={isLoading}
          onSaveDraft={handleManualSave}
          saveStatus={saveStatus}
        />
      </form>
    </FormProvider>
  );
}
