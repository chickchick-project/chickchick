export interface ICommentAuthProfileProps {
  author: string;
  profileImage?: string;
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
  replies?: TComment[];
};

export interface ICommentIListProps {
  commentList: TComment[];
}

export interface ICommentFormProps {
  type: "create" | "reply" | "edit";
  value?: string;
  authInfo?: ICommentAuthInfoProps;
  commentId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export type TCommentActionState = {
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  replyingCommentId: string | null;
  setReplyingCommentId: (id: string | null) => void;
};
