import { ActionItem, Actions } from "@/components/commons/actions";
import PostTime from "@/components/commons/author/PostTime";
import {
  CommentReplyResponse,
  CommentResponse,
} from "@/server/hono/schemas/comment.schema";
import { useCommentMutation } from "@/client/hooks/query/useCommentQuery";
import { useUserStore } from "@/client/stores/useUserStore";

import { CommentAuthInfo } from "./CommentAuthInfo";
import CommentForm from "./CommentForm";
import { CommentActionState } from "./postComment.types";
import ReplyIcon from "./ReplyIcon";

interface CommentListItemProps {
  commentActionState: CommentActionState;
  comment: CommentResponse | CommentReplyResponse;
  postAuthorId: string;
  isReplyType?: boolean;
}

export default function CommentListItem({
  commentActionState,
  comment,
  postAuthorId,
  isReplyType = false,
}: CommentListItemProps) {
  const {
    editingCommentId,
    setEditingCommentId,
    replyingCommentId,
    setReplyingCommentId,
  } = commentActionState;
  const { user } = useUserStore();
  const {
    id,
    author,
    createdAt,
    updatedAt,
    content,
    postId,
    parentId,
    published,
  } = comment;
  const isAuthor = author.id === user?.id;
  const isPostAuthor = author.id === postAuthorId;
  const isEditing = editingCommentId === id;
  const isReplying = replyingCommentId === id;
  const isAnyCommentBeingEdited = editingCommentId !== null;
  const isAnyCommentBeingReplied = replyingCommentId !== null;
  const isEdited = updatedAt
    ? new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000
    : false;
  const { deleteMutation } = useCommentMutation(postId);
  const { isPending: isDeleting } = deleteMutation;
  const userActions: ActionItem[] = [
    {
      type: "reply",
      onClick: () => {
        setEditingCommentId(null);
        setReplyingCommentId(id);
      },
      disabled: isAnyCommentBeingEdited,
    },
  ];

  const authorActions: ActionItem[] = [
    {
      type: "edit",
      onClick: () => {
        setReplyingCommentId(null);
        setEditingCommentId(id);
      },
      disabled: isAnyCommentBeingReplied || isAnyCommentBeingEdited,
    },
    {
      type: "delete",
      onClick: () => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
          deleteMutation.mutate(id);
        }
      },
      disabled:
        isAnyCommentBeingReplied || isAnyCommentBeingEdited || isDeleting,
    },
  ];

  let actions: ActionItem[] = [];

  if (isEditing || isReplying) {
    actions = [
      {
        type: "cancel",
        onClick: () => {
          setEditingCommentId(null);
          setReplyingCommentId(null);
        },
      },
    ];
  } else {
    if (!isReplyType) {
      actions.push(...userActions);
    }

    if (isAuthor) {
      actions.push(...authorActions);
    }
  }

  const onEditSuccess = () => {
    setEditingCommentId(null);
  };

  const onReplySuccess = () => {
    setReplyingCommentId(null);
  };

  return (
    <>
      <li>
        <div className={`py-5 ${isReplyType && "flex tablet:gap-5 gap-2"}`}>
          {isReplyType && <ReplyIcon />}
          <article className="w-full flex flex-col gap-2">
            {published && (
              <section className="flex items-center justify-between">
                <CommentAuthInfo
                  author={author.nickname}
                  profileImage={author.imageUrl}
                  isPostAuthor={isPostAuthor}
                />
                {actions.length > 0 && !isReplying && (
                  <Actions actions={actions} />
                )}
              </section>
            )}
            {isEditing ? (
              <CommentForm
                type="edit"
                value={content}
                commentId={editingCommentId}
                parentId={parentId}
                postId={postId}
                onSuccess={onEditSuccess}
              />
            ) : (
              <div className="px-9">
                <p
                  className={`text-body-1 font-medium ${
                    published ? "text-black-200 mb-1" : "text-gray-400"
                  } leading-6`}
                >
                  {content}
                  {published && isEdited && (
                    <span className="text-gray-100 text-label-2 ml-1">
                      (수정됨)
                    </span>
                  )}
                </p>

                {published && (
                  <PostTime type="comment" time={createdAt} size="default" />
                )}
              </div>
            )}
          </article>
        </div>
        <div className="divider-horizontal" />
      </li>
      {"replies" in comment &&
        comment.replies &&
        comment.replies.length > 0 &&
        comment.replies.map((reply) => (
          <ul key={reply.id}>
            <CommentListItem
              postAuthorId={postAuthorId}
              commentActionState={commentActionState}
              comment={reply}
              isReplyType
            />
          </ul>
        ))}

      {isReplying && user && (
        <>
          <section className="flex gap-5 py-5">
            <ReplyIcon />
            <div className="w-full">
              <div className="mb-3 flex items-center justify-between">
                <CommentAuthInfo
                  author={user.nickname}
                  profileImage={user.imageUrl}
                  size={36}
                />
                <Actions actions={actions} />
              </div>
              <CommentForm
                type="reply"
                postId={postId}
                commentId={replyingCommentId}
                onSuccess={onReplySuccess}
              />
            </div>
          </section>
          <div className="divider-horizontal" />
        </>
      )}
    </>
  );
}
