import { useState, useEffect } from "react";

/**
 * HTML 문자열을 소독(sanitize)하는 훅.
 * @param htmlContent - 소독할 원본 HTML 문자열
 * @returns 소독된 HTML 문자열
 */

export const useSanitizedHtml = (htmlContent: string) => {
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    import("dompurify").then((module) => {
      const DOMPurify = module.default;
      setProcessedContent(DOMPurify.sanitize(htmlContent));
    });
  }, [htmlContent]);

  return processedContent;
};
