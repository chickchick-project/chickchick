import type { CommentResponse } from "@/server/hono/schemas/comment.schema";

export interface CommentAuthInfoProps {
  author: string;
  profileImage?: string | null;
  size?: number;
  isPostAuthor?: boolean;
}

export interface CommentListProps {
  commentList: CommentResponse[];
  onLoadMore: () => void;
  hasNextCursor?: boolean;
  isLoadingComments?: boolean;
  postAuthorId: string;
}

export interface CommentFormProps {
  type: "create" | "reply" | "edit";
  value?: string;
  authInfo?: CommentAuthInfoProps;
  commentId?: string;
  postId: string;
  parentId?: string | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface CommentActionState {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  replyingCommentId: string | null;
  setReplyingCommentId: (id: string | null) => void;
}
