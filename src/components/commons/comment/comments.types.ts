import { COMMENT_TYPES } from "./comments.constants";

export type CommentType = (typeof COMMENT_TYPES)[keyof typeof COMMENT_TYPES];

export interface CommentProps {
  type: CommentType;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}
