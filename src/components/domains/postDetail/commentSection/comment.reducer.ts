import { CommentResponse } from "@/lib/hono/schemas/comment.schema";

export const ADD_NEW_COMMENT = "ADD_NEW_COMMENT";
export const ADD_NEW_REPLY = "ADD_NEW_REPLY";
export const ADD_MORE_COMMENTS = "ADD_MORE_COMMENTS";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";

export type CommentAction =
  | { type: typeof ADD_NEW_COMMENT; payload: CommentResponse }
  | {
      type: typeof ADD_NEW_REPLY;
      payload: CommentResponse;
    }
  | { type: typeof ADD_MORE_COMMENTS; payload: CommentResponse[] }
  | {
      type: typeof UPDATE_COMMENT;
      payload: { id: string; content: string; parentId: string | null };
    }
  | {
      type: typeof DELETE_COMMENT;
      payload: { id: string; parentId: string | null };
    };

export function commentsReducer(
  state: CommentResponse[],
  action: CommentAction
): CommentResponse[] {
  switch (action.type) {
    case ADD_NEW_COMMENT:
      return [action.payload, ...state];
    case ADD_NEW_REPLY:
      const newReply = action.payload;
      return state.map((comment) => {
        if (comment.id === newReply.parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply],
          };
        }
        return comment;
      });
    case ADD_MORE_COMMENTS:
      const newComments = action.payload;
      const uniqueComments = newComments.filter(
        (newComment) => !state.some((prev) => prev.id === newComment.id)
      );
      return [...state, ...uniqueComments];
    case UPDATE_COMMENT:
      const { id, content } = action.payload;
      if (action.payload.parentId) {
        return state.map((comment) => {
          if (comment.id === action.payload.parentId) {
            return {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === id ? { ...reply, content } : reply
              ),
            };
          }
          return comment;
        });
      }
      return state.map((comment) =>
        comment.id === id ? { ...comment, content } : comment
      );
    case DELETE_COMMENT: // 삭제 처리 상의
      const { id: deleteId, parentId: deleteParentId } = action.payload;
      if (deleteParentId) {
        return state.map((comment) => {
          if (comment.id === deleteParentId) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== deleteId),
            };
          }
          return comment;
        });
      }
      return state.filter((comment) => comment.id !== deleteId);
    default:
      return state;
  }
}
