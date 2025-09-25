import { CommentResponse } from "@/lib/hono/schemas/comment.schema";

export interface ICommentAuthInfoProps {
  author: string;
  profileImage?: string | null;
  size?: number;
  isPostAuthor?: boolean;
}

export type TComment = {
  id: string;
  authInfo: ICommentAuthInfoProps;
  content: string;
  createdAt: string;
  isAuthor: boolean;
  replies?: CommentResponse[];
};

export interface ICommentIListProps {
  commentList: CommentResponse[];
  onLoadMore: () => void;
  hasNextCursor?: boolean;
  isLoadingComments?: boolean;
  postAuthorId: string;
}

export interface ICommentFormProps {
  type: "create" | "reply" | "edit";
  value?: string;
  authInfo?: ICommentAuthInfoProps;
  commentId?: string;
  postId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export type TCommentActionState = {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  replyingCommentId: string | null;
  setReplyingCommentId: (id: string | null) => void;
};
