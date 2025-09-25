import { ICommentAuthInfoProps } from "./postComment.types";
import AuthorProfile from "@/components/commons/author/AuthorProfile";

export function CommentAuthInfo({
  author,
  profileImage,
  size,
  isPostAuthor,
}: ICommentAuthInfoProps) {
  return (
    <div className="text-black-200 flex items-center justify-center gap-2">
      <AuthorProfile name={author} profileImage={profileImage} size={size} />
      {isPostAuthor && (
        <div className="text-label-5 text-primary-100 border rounded-full px-1 border-primary-100 ">
          작성자
        </div>
      )}
    </div>
  );
}
