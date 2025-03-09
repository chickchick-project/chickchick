import { COMMENT_PLACEHOLDERS, COMMENT_TYPES } from "@/lib/constants/comments";
import React, { useState, useRef } from "react";

const COMMENT_STYLES = {
  [COMMENT_TYPES.POST]:
    " h-[140px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)]",
  [COMMENT_TYPES.REVIEW]: "h-[200px] bg-white border border-gray-200",
} as const;

export type CommentType = (typeof COMMENT_TYPES)[keyof typeof COMMENT_TYPES];

export interface CommentProps {
  type: CommentType;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  type,
  placeholder,
  value = "",
  maxLength = 500,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxLength) return;

    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div
      className={`relative p-5 rounded-xl text-body-2 font-medium ${COMMENT_STYLES[type]}`}
    >
      <textarea
        ref={textAreaRef}
        className="w-full resize-none overflow-hidden bg-transparent outline-none text-gray-700"
        placeholder={placeholder || COMMENT_PLACEHOLDERS[type]}
        value={inputValue}
        onChange={handleChange}
        rows={1}
      />
      <span
        className={`absolute bottom-5 right-5 text-xs ${
          inputValue.length >= maxLength ? "text-red-500" : "text-gray-400"
        }`}
      >
        {inputValue.length}/{maxLength}
      </span>
    </div>
  );
};

export default Comment;
