import React, { useState, useRef } from "react";
import { COMMENT_PLACEHOLDERS, COMMENT_STYLES } from "./comments.constants";
import { CommentProps } from "./comments.types";

export default function Comment({
  type,
  placeholder,
  value = "",
  maxLength = 500,
  onChange,
}: CommentProps) {
  const [inputValue, setInputValue] = useState(value);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > maxLength) return;

    setInputValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div
      className={`w-full relative p-5 rounded-xl text-body-2 font-medium ${COMMENT_STYLES[type]}`}
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
}
