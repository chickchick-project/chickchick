import AuthorInfo from "@/components/commons/author/AuthorInfo";
import {
  ICommentAuthInfoProps,
  ICommentAuthProfileProps,
} from "./postComment.types";
import AuthorProfile from "@/components/commons/author/AuthorProfile";

export function CommentAuthInfo({
  author,
  createdAt,
  profileImage,
}: ICommentAuthInfoProps) {
  return (
    <>
      <AuthorInfo
        info={{
          type: "comment",
        }}
        author={{
          id: "unknown",
          nickname: author,
          imageUrl: profileImage || "",
        }}
        createdAt={new Date(createdAt)}
        isAuthor={false}
        // size="large"
      />
    </>
  );
}

export function CommentUserProfile({
  author,
  profileImage,
}: ICommentAuthProfileProps) {
  return <AuthorProfile name={author} profileImage={profileImage} size={36} />;
}
