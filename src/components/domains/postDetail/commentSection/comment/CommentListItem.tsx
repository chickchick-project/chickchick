import { ActionItem, Actions } from "@/components/commons/actions";
import { CommentAuthInfo, CommentUserProfile } from "./CommentAuthInfo";
import { TComment, TCommentActionState } from "./postComment.types";
import CommentForm from "./CommentForm";
import ReplyIcon from "./ReplyIcon";

export default function CommentIListItem({
  commentActionState,
  comment,
  isReplyType = false,
}: {
  commentActionState: TCommentActionState;
  comment: TComment;
  isReplyType?: boolean;
}) {
  const {
    editingCommentId,
    setEditingCommentId,
    replyingCommentId,
    setReplyingCommentId,
  } = commentActionState;

  const { id, authInfo, isAuthor, createdAt, content, replies } = comment;
  const isEditing = editingCommentId === id;
  const isReplying = replyingCommentId === id;
  const isAnyCommentBeingEdited = editingCommentId !== null;
  const isAnyCommentBeingReplied = replyingCommentId !== null;

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
      onClick: () => alert("삭제"),
      disabled: isAnyCommentBeingReplied || isAnyCommentBeingEdited,
    },
  ];

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
  } else if (isAuthor) {
    actions = authorActions;
  } else if (!isReplyType) {
    actions = userActions;
  }

  return (
    <>
      <li>
        <div className={`py-5 ${isReplyType && "flex gap-5"}`}>
          {isReplyType && <ReplyIcon />}
          <article className="w-full flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CommentAuthInfo
                author={authInfo.author}
                profileImage={authInfo.profileImage}
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
                onSubmit={() => {
                  setEditingCommentId(null);
                }}
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
      {replies &&
        replies.length > 0 &&
        replies.map((reply) => (
          <ul key={reply.id}>
            <CommentIListItem
              commentActionState={commentActionState}
              comment={reply}
              isReplyType
            />
          </ul>
        ))}
      {isReplying && (
        <>
          <section className="flex gap-5 py-5">
            <ReplyIcon />
            <div className="w-full">
              <div className="mb-3 flex items-center justify-between">
                <CommentUserProfile
                  author={"로그인한 유저 닉네임"}
                  profileImage={""}
                />
                <Actions actions={actions} />
              </div>
              <CommentForm
                type="reply"
                commentId={replyingCommentId}
                onSubmit={() => setReplyingCommentId(null)}
              />
            </div>
          </section>
          <div className="divider-horizontal" />
        </>
      )}
    </>
  );
}
