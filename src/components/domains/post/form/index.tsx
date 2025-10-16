"use client";

import { useRef } from "react";

import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostTitle from "./PostTitle";
import { extractFirstImageSrc } from "@/lib/utils/extractFirstImageSrc";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PostCategory from "./PostCategory";
import getPlainText from "@/lib/utils/getPlainText";
import { PostCategory as TPostCategory } from "@prisma/client";
import PostRelatedPerfume from "./postRelatedPerfume/PostRelatedPerfume";
import { finalizeWithBlobRegistry } from "@/lib/ckeditor/finalizeWithBlobRegistry";
import type { BlobRegistry } from "@/lib/ckeditor/localPreviewUploadPlugin";
import {
  CreatePostInput,
  CreatePostInputSchema,
  PerfumeForPost,
} from "@/lib/hono/schemas/community.schema";
import usePostMutation from "../usePostMutation";

export type TPostFormInitialData = CreatePostInput & {
  perfumes: PerfumeForPost[] | [];
};
interface IPostFormProps {
  type: "create" | "edit";
  initialData?: TPostFormInitialData;
  postId?: string;
}

export default function PostForm({
  type,
  initialData,
  postId,
}: IPostFormProps) {
  const blobRegistryRef = useRef<BlobRegistry>(new Map());

  const method = useForm<CreatePostInput>({
    resolver: zodResolver(CreatePostInputSchema),
    mode: "onChange",
    defaultValues: {
      category: initialData?.category ?? ("" as unknown as TPostCategory),
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      contentText: initialData?.contentText ?? "",
      thumbnailUrl: initialData?.thumbnailUrl ?? null,
    },
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
  } = method;

  const { createMutation, editMutation } = usePostMutation(postId);
  const isLoading = createMutation.isPending || editMutation.isPending;

  const onSubmit = async (data: CreatePostInput) => {
    const finalizedContent = await finalizeWithBlobRegistry(
      data.content,
      blobRegistryRef.current
    );
    setValue("content", finalizedContent, { shouldDirty: true });
    const thumbnailUrl = extractFirstImageSrc(finalizedContent);
    const contentText = getPlainText(finalizedContent);
    const postData: CreatePostInput = {
      ...data,
      content: finalizedContent,
      thumbnailUrl,
      contentText,
    };

    if (type === "create") {
      createMutation.mutate(postData);
    } else if (type === "edit") {
      editMutation.mutate(postData);
    }
  };

  const disabled = !isDirty || !isValid || isLoading;

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
          <PostRelatedPerfume initialPerfumes={initialData?.perfumes} />
        </div>
        <PostFormActions disabled={disabled} />
      </form>
    </FormProvider>
  );
}
