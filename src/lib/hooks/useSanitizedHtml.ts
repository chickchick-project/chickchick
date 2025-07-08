import { useState, useEffect } from "react";

const BLOCK_TAG_REGEX = /<\/p>|<\/div>|<\/h[1-6]>|<br\s*\/?>/gi;
const ALL_HTML_TAGS_REGEX = /<[^>]*>?/gm;
const MULTIPLE_SPACES_REGEX = /\s+/g;

interface SanitizeOptions {
  preview?: boolean; // 모든 태그를 제거하고 순수 텍스트로 미리보기를 생성
}

/**
 * HTML 문자열을 순수 텍스트(preview용)로 만들거나 소독하는 훅.
 * 이 훅은 클라이언트 측에서만 실행되어야함.
 * @param htmlContent - 소독할 원본 HTML 문자열
 * @param options - 처리 옵션
 * @returns 소독된 HTML 문자열
 */

export const useSanitizedHtml = (
  htmlContent: string,
  options: SanitizeOptions = {}
) => {
  const [processedContent, setProcessedContent] = useState("");

  useEffect(() => {
    if (options.preview) {
      let content = htmlContent;
      content = content.replace(BLOCK_TAG_REGEX, " ");
      content = content.replace(ALL_HTML_TAGS_REGEX, "");
      content = content.replace(MULTIPLE_SPACES_REGEX, " ").trim();
      setProcessedContent(content);
      return;
    }

    import("dompurify").then((module) => {
      const DOMPurify = module.default;
      setProcessedContent(DOMPurify.sanitize(htmlContent));
    });
  }, [htmlContent, options]);

  return processedContent;
};
