import { CommentResponse } from "@/lib/hono/schemas/comment.schema";

export interface ICommentAuthProfileProps {
  author: string;
  profileImage?: string | null;
}

export interface ICommentAuthInfoProps extends ICommentAuthProfileProps {
  createdAt: string;
}

export type TComment = {
  id: string;
  authInfo: ICommentAuthProfileProps;
  content: string;
  createdAt: string;
  isAuthor: boolean;
  replies?: CommentResponse[];
};

export interface ICommentIListProps {
  commentList: CommentResponse[];
}

export interface ICommentFormProps {
  type: "create" | "reply" | "edit";
  value?: string;
  authInfo?: ICommentAuthInfoProps;
  commentId?: string;
  postId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type TCommentActionState = {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  replyingCommentId: string | null;
  setReplyingCommentId: (id: string | null) => void;
};
