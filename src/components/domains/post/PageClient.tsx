"use client";

import PostForm from "./form";
import { TPostFormData } from "./form/postSchema";
import Header from "./header";

interface IPostFormPageProps {
  type: "create" | "edit";
  initialData?: TPostFormData;
}

export default function PageClient({ type, initialData }: IPostFormPageProps) {
  // const { user } = useUserStore();
  // if (!user) {
  //   return (
  //     <div className="w-full h-screen flex items-center justify-center">
  //       <p className="text-lg text-gray-600">로그인이 필요합니다.</p>
  //     </div>
  //   );
  // }
  return (
    <div className="px-4 w-full flex flex-col items-center gap-5 pb-[150px]">
      <Header />
      <PostForm type={type} initialData={initialData} />
    </div>
  );
}
