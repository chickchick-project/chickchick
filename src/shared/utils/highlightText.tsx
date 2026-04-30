import React from "react";

/**
 * 텍스트에서 검색어와 일치하는 부분을 하이라이트합니다.
 * @param text - 원본 텍스트
 * @param query - 검색어
 * @returns 하이라이트된 JSX 요소
 */
export function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <span key={index} className="text-primary-300 font-semibold">
          {part}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}
