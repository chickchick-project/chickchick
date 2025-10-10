import React from "react";
import Reply from "@/components/domains/user/Reply";
import { MyComment } from "@/lib/hono/services/me.service";

export const MyCommentsList = ({ comments }: { comments: MyComment[] }) => {
  return comments.map((item, idx) => (
    <Reply key={item.id} {...item} isLast={idx === comments.length - 1} />
  ));
};
