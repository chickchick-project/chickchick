"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostTitle from "./PostTitle";
import { extractFirstImageSrc } from "@/lib/utils/extractFirstImageSrc";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PostCategory from "./PostCategory";
import { submitNewPost } from "../post.helpers";
import {
  CreatePost,
  CreatePostBodySchema,
} from "@/lib/hono/schemas/community.schema";
import getPlainText from "@/lib/utils/getPlainText";
import { PostCategory as TPostCategory } from "@prisma/client";
import PostRelatedPerfume from "./postRelatedPerfume/PostRelatedPerfume";
import { BlobRegistry } from "@/lib/ckeditor/localPreviewUploadPlugin";
import { finalizeWithBlobRegistry } from "@/lib/ckeditor/finalizeWithBlobRegistry";

interface IPostFormProps {
  type: "create" | "edit";
  initialData?: CreatePost;
}

export default function PostForm({ type, initialData }: IPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const blobRegistryRef = useRef<BlobRegistry>(new Map());

  const method = useForm<CreatePost>({
    resolver: zodResolver(CreatePostBodySchema),
    mode: "onChange",
    defaultValues: {
      category: initialData?.category ?? ("" as unknown as TPostCategory),
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      contentText: initialData?.contentText ?? "",
      thumbnailUrl: initialData?.thumbnailUrl ?? null,
      perfumeIds: initialData?.perfumeIds,
    },
  });
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
  } = method;

  const onSubmit = async (data: CreatePost) => {
    setIsLoading(true);

    try {
      const finalizedContent = await finalizeWithBlobRegistry(
        data.content,
        blobRegistryRef.current
      );
      setValue("content", finalizedContent, { shouldDirty: true });
      const thumbnailUrl = extractFirstImageSrc(finalizedContent);
      const contentText = getPlainText(finalizedContent);
      const postData: CreatePost = {
        ...data,
        content: finalizedContent,
        thumbnailUrl,
        contentText,
      };

      if (type === "create") {
        const result = await submitNewPost(postData);
        if (result.success && result.data) {
          router.push(`/community/post/${result.data.id}`);
        }
      }
      //게시글 수정 추가
    } catch (error) {
      console.error("Error submitting new post:", error);
    } finally {
      setIsLoading(false);
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
          <PostRelatedPerfume />
        </div>
        <PostFormActions disabled={disabled} />
      </form>
    </FormProvider>
  );
}
