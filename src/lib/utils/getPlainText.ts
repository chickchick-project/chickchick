const BLOCK_SEPARATOR_REGEX = /<\/p>|<\/div>|<\/h[1-6]>|<\/li>|<br\s*\/?>/gi;
const MULTIPLE_SPACES_REGEX = /\s+/g;

/**
 * HTML 문자열에서 순수 텍스트를 추출합니다.
 * @param htmlContent 원본 HTML 문자열
 * @returns 추출된 순수 텍스트
 */
export default function getPlainText(htmlContent: string): string {
  if (typeof window === "undefined" || !htmlContent) {
    return "";
  }

  const spacedHtml = htmlContent.replace(BLOCK_SEPARATOR_REGEX, " ");
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = spacedHtml;
  const textFromDom = tempDiv.innerText || "";
  const plainText = textFromDom.replace(MULTIPLE_SPACES_REGEX, " ").trim();
  return plainText;
}
