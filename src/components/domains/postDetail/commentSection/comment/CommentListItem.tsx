import { ActionItem, Actions } from "@/components/commons/actions";
import { CommentAuthInfo, CommentUserProfile } from "./CommentAuthInfo";
import { TCommentActionState } from "./postComment.types";
import CommentForm from "./CommentForm";
import ReplyIcon from "./ReplyIcon";
import {
  CommentReplyResponse,
  CommentResponse,
} from "@/lib/hono/schemas/comment.schema";
import { useUserStore } from "@/lib/stores/useUserStore";
import { CommentAction, DELETE_COMMENT } from "../comment.reducer";

export default function CommentListItem({
  commentActionState,
  comment,
  onAction,
  isReplyType = false,
}: {
  commentActionState: TCommentActionState;
  comment: CommentResponse | CommentReplyResponse;
  onAction: (action: CommentAction) => void;
  isReplyType?: boolean;
}) {
  const {
    editingCommentId,
    setEditingCommentId,
    replyingCommentId,
    setReplyingCommentId,
  } = commentActionState;
  const { user } = useUserStore();
  const { id, author, createdAt, content, postId, parentId } = comment;
  const isAuthor = author.id === user?.id;
  const isEditing = editingCommentId === id;
  const isReplying = replyingCommentId === id;
  const isAnyCommentBeingEdited = editingCommentId !== null;
  const isAnyCommentBeingReplied = replyingCommentId !== null;
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
          //삭제 api 구현 후 연동 필요
          onAction({ type: DELETE_COMMENT, payload: { id, parentId } }); //삭제처리 답글이 있는 경우 고려 필요
        }
      },
      disabled: isAnyCommentBeingReplied || isAnyCommentBeingEdited,
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

  const onEditSuccess = (action: CommentAction) => {
    onAction(action);
    setEditingCommentId(null);
  };

  const onReplySuccess = (action: CommentAction) => {
    onAction(action);
    setReplyingCommentId(null);
  };

  return (
    <>
      <li>
        <div className={`py-5 ${isReplyType && "flex gap-5"}`}>
          {isReplyType && <ReplyIcon />}
          <article className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CommentAuthInfo
                author={author.nickname}
                profileImage={author.imageUrl}
                createdAt={createdAt}
              />
              {actions.length > 0 && !isReplying && (
                <Actions actions={actions} />
              )}
            </div>
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
              <p className="px-5 text-body-2 font-medium text-black-100 leading-6">
                {content}
              </p>
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
              commentActionState={commentActionState}
              comment={reply}
              isReplyType
              onAction={onAction}
            />
          </ul>
        ))}

      {isReplying && user && (
        <>
          <section className="flex gap-5 py-5">
            <ReplyIcon />
            <div className="w-full">
              <div className="mb-3 flex items-center justify-between">
                <CommentUserProfile
                  author={user.nickname}
                  profileImage={user.imageUrl}
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
