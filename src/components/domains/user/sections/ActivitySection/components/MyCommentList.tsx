import React from "react";
import Reply from "@/components/domains/user/Reply";
import { mockReplyData } from "@/lib/mocks/reply";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const MyCommentsList = ({
  comments,
}: {
  comments: PostCardProps[];
}) => {
  return comments.map((item, idx) => (
    <Reply
      key={item.id}
      {...mockReplyData}
      postInfo={{
        id: item.id.toString(),
        title: "[서울 동대문구]올리브영 향수 나눔합니다!",
      }}
      isLast={idx === comments.length - 1}
    />
  ));
};
