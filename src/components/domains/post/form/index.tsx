"use client";
import { useState } from "react";
import PostCategory from "./PostCategory";
import PostEditor from "./PostEditor";
import PostFormActions from "./PostFormActions";
import PostRelatedPerfume from "./PostRelatedPerfume";
import PostTitle from "./PostTitle";

export default function PostForm() {
  const [category, setCategory] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // const [relatedPerfume, setRelatedPerfume] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const postData = {
      category,
      title,
      content,
      // relatedPerfume,
    };
    console.table(postData);
    alert(JSON.stringify(postData));
  };

  return (
    <form
      className="w-full flex flex-col items-center gap-14"
      onSubmit={handleSubmit}
    >
      <div className="w-full grid grid-cols-1 tablet:grid-cols-[85px_1fr] tablet:gap-x-[200px] gap-y-2 tablet:gap-y-14">
        <PostCategory
          value={category}
          onChange={(category: string) => setCategory(category)}
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
        <PostRelatedPerfume />
      </div>
      <PostFormActions />
    </form>
  );
}
