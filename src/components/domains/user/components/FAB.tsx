"use client";

import React from "react";

interface FloatingActionButtonProps {
  onClick: () => void;
  show: boolean;
}

export const FloatingActionButton = ({
  onClick,
  show,
}: FloatingActionButtonProps) => {
  if (!show) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-16 right-6 z-50 w-14 h-14 bg-primary-200 hover:bg-primary-300 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
      aria-label="사진 추가"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19M5 12H19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};
