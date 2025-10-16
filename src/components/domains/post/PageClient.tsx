"use client";

import { useQuery } from "@tanstack/react-query";
import PostForm, { TPostFormInitialData } from "./form";
import Header from "./header";
import { getPostDetailById } from "../postDetail/postDetail.helpers";
import { useUserStore } from "@/lib/stores/useUserStore";
import { useRouter } from "next/navigation";
// import { Spinner } from "@/components/commons/loading/Spinner";
// import { useEffect } from "react";

interface IPostFormPageProps {
  type: "create" | "edit";
  postId?: string;
}

export default function PageClient({ type, postId }: IPostFormPageProps) {
  const { user, isLoading: isAuthLoading } = useUserStore();
  const router = useRouter();

  const { data: post, isError } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetailById(postId!),
    enabled: type === "edit" && !!postId && !!user,
  });

  // useEffect(() => {
  //   if (!isAuthLoading && !user) {
  //     router.replace("/");
  //   }
  // }, [isAuthLoading, user, router]);

  // if (isAuthLoading || !user) {
  //   return <Spinner />;
  // }

  if (isError) return <div>데이터를 불러오는 데 실패했습니다.</div>;

  const initialData: TPostFormInitialData | undefined =
    type === "edit" && post
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
      <PostForm type={type} initialData={initialData} postId={postId} />
    </div>
  );
}
