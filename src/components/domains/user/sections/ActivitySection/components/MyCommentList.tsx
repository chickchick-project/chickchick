import React from "react";
import Reply from "@/components/domains/user/Reply";
import { mockReplyData } from "@/lib/mocks/reply";

export const MyCommentsList = ({ comments }: { comments: any[] }) => {
  return comments.map((item, idx) => (
    <Reply
      key={item.id}
      {...mockReplyData}
      postInfo={{
        id: item.postId.toString(),
        title: "[서울 동대문구]올리브영 향수 나눔합니다!",
      }}
      isLast={idx === comments.length - 1}
    />
  ));
};
