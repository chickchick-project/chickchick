"use client";
import { useState } from "react";

import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostRelatedPerfume from "./PostRelatedPerfume";
import PostTitle from "./PostTitle";
import { extractFirstImageSrc } from "@/lib/utils/extractFirstImageSrc";
import { submitPost } from "../post.helpers";
import {
  TPostCategory,
  TPostCreateInput,
} from "@/lib/queries/community/postQueries";
import PostCategory from "./PostCategory";

export default function PostForm() {
  const [category, setCategory] = useState<TPostCategory>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // const [relatedPerfume, setRelatedPerfume] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    if (!category || !title || !content) {
      console.log("카테고리, 제목, 내용을 모두 입력해주세요.");
      return;
    }
    e.preventDefault();
    const thumbnailUrl = extractFirstImageSrc(content);
    const postFormData: TPostCreateInput = {
      category,
      title,
      content,
      thumbnailUrl,
      // relatedPerfume,
    };
    submitPost(postFormData);
  };

  return (
    <form
      className="w-full flex flex-col items-center gap-14"
      onSubmit={handleSubmit}
    >
      <div className="w-full grid grid-cols-1 tablet:grid-cols-[85px_1fr] tablet:gap-x-[200px] gap-y-2 tablet:gap-y-14">
        <PostCategory
          value={category}
          onChange={(category: TPostCategory) => setCategory(category)}
        />
        <PostTitle
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <PostEditor
          value={content}
          onChange={(content: string) => setContent(content)}
        />
        {/* <input type="hidden" name="content" value={content} /> */}
        <PostRelatedPerfume />
      </div>
      <PostFormActions disabled={!category && !title && !content} />
    </form>
  );
}
