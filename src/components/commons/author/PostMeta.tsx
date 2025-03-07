import React from "react";
import IconBadge from "../author/IconBadge";
import { PostMetaItem } from "@/lib/constants/author";
import ICONS from "@/lib/constants/icons";

interface PostMetaProps {
  meta: PostMetaItem[];
}

const PostMeta: React.FC<PostMetaProps> = ({ meta }) => {
  return (
    <div className="flex gap-2">
      {meta.map((item) => (
        <IconBadge
          key={item.type}
          iconSrc={ICONS[item.type]?.src || ""}
          altText={item.type}
          count={item.count}
        />
      ))}
    </div>
  );
};

export default PostMeta;
