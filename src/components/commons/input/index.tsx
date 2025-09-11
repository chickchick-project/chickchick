import React from "react";

export interface InputBaseProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isError: boolean;
  helperText?: string;
  maxWidth?: string;
}

export default function InputBase({
  className,
  helperText,
  isError,
  maxWidth = "400px",
  ...props
}: InputBaseProps) {
  return (
    <div className={`w-full max-w-[${maxWidth}] flex flex-col`}>
      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded-lg outline-none
          text-body-2 font-medium
          border 
          ${
            isError
              ? "border-red focus:border-red-300"
              : "border-gray-100 focus:border-primary-300 "
          }
          ${className}
        `}
      />
      <p
        className={`
          mt-1 text-label-2 font-medium
          ${isError ? "text-red" : "text-gray-100"}
        `}
      >
        {helperText}
      </p>
    </div>
  );
}
