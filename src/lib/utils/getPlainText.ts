const BLOCK_SEPARATOR_REGEX = /<\/p>|<\/div>|<\/h[1-6]>|<\/li>|<br\s*\/?>/gi;
const ALL_HTML_TAGS_REGEX = /<[^>]*>?/gm;
const MULTIPLE_SPACES_REGEX = /\s+/g;

/**
 * HTML 문자열에서 순수 텍스트를 추출합니다.
 * @param htmlContent 원본 HTML 문자열
 * @returns 추출된 순수 텍스트
 */
export function getPlainText(htmlContent: string): string {
  if (!htmlContent) {
    return "";
  }

  const plainText = htmlContent
    .replace(BLOCK_SEPARATOR_REGEX, " ")
    .replace(ALL_HTML_TAGS_REGEX, "")
    .replace(MULTIPLE_SPACES_REGEX, " ")
    .trim();

  return plainText;
}
