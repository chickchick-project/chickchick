"use client";

import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostRelatedPerfume from "./PostRelatedPerfume";
import PostTitle from "./PostTitle";
import { extractFirstImageSrc } from "@/lib/utils/extractFirstImageSrc";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TPostInput,
  TPostFormData,
  TPostCategory,
} from "@/lib/queries/community/postQueries";
import PostCategory from "./PostCategory";

import { submitNewPost } from "../post.helpers";
import { postSchema } from "./postSchema";

interface IPostFormProps {
  type: "create" | "edit";
  initialData?: TPostFormData;
}

export default function PostForm({ type, initialData }: IPostFormProps) {
  // const [relatedPerfume, setRelatedPerfume] = useState<string | null>(null);

  const method = useForm<TPostInput>({
    resolver: zodResolver(postSchema),
    mode: "onChange",
    defaultValues: {
      category: initialData?.category ?? "",
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      thumbnailUrl: initialData?.thumbnailUrl ?? null,
    },
  });
  const {
    handleSubmit,
    formState: { isValid, isDirty, isSubmitting },
  } = method;

  const onSubmit = async (data: TPostInput) => {
    const thumbnailUrl = extractFirstImageSrc(data.content);

    const postData: TPostFormData = {
      ...data,
      category: data.category as TPostCategory,
      thumbnailUrl,
    };
    if (type === "create") {
      await submitNewPost(postData);
    }
  };

  return (
    <FormProvider {...method}>
      <form
        className="w-full flex flex-col items-center gap-14"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full grid grid-cols-1 tablet:grid-cols-[85px_1fr] tablet:gap-x-[200px] gap-y-2 tablet:gap-y-14">
          <PostCategory />
          <PostTitle />
          <PostEditor />
          <PostRelatedPerfume />
        </div>
        <PostFormActions disabled={!isDirty || !isValid || isSubmitting} />
      </form>
    </FormProvider>
  );
}
