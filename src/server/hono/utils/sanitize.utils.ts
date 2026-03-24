import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

/**
 * 서버 사이드에서 HTML을 sanitize하고 이미지를 최적화합니다.
 * XSS 공격을 방지하기 위해 위험한 태그와 속성을 제거하고,
 * 외부 이미지에 lazy loading과 최적화 속성을 추가합니다.
 *
 * @param html - 처리할 원본 HTML 문자열
 * @returns sanitize 및 이미지 최적화가 완료된 HTML 문자열
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // JSDOM을 사용하여 서버 환경에서 DOM API 제공
  const window = new JSDOM("").window;
  const purify = DOMPurify(window);

  // Sanitize 옵션 설정
  const cleanHtml = purify.sanitize(html, {
    ALLOWED_TAGS: [
      // 텍스트 포맷팅
      "p", "br", "strong", "em", "u", "s", "sub", "sup",
      // 제목
      "h1", "h2", "h3", "h4", "h5", "h6",
      // 리스트
      "ul", "ol", "li",
      // 링크 및 미디어
      "a", "img", "figure", "figcaption",
      // 테이블
      "table", "thead", "tbody", "tr", "th", "td",
      // 기타
      "blockquote", "code", "pre", "span", "div",
    ],
    ALLOWED_ATTR: [
      // 링크 속성
      "href", "target", "rel",
      // 이미지 속성
      "src", "alt", "width", "height", "loading", "decoding", "fetchpriority",
      // 스타일 및 기타
      "class", "style", "data-optimized",
    ],
    // 외부 링크에 자동으로 rel="noopener noreferrer" 추가
    ALLOW_UNKNOWN_PROTOCOLS: false,
  });

  // 이미지 최적화 적용
  return optimizeImagesInHtml(cleanHtml);
}

/**
 * HTML 문자열 내의 이미지 태그를 최적화합니다.
 * 외부 이미지에 lazy loading과 최적화 속성을 추가합니다.
 *
 * @param html - 최적화할 HTML 문자열
 * @returns 이미지가 최적화된 HTML 문자열
 */
function optimizeImagesInHtml(html: string): string {
  if (!html) return "";

  let isFirstImage = true;

  return html.replace(
    /<img([^>]*?)>/gi,
    (match) => {
      // src 속성 추출
      const srcMatch = match.match(/src=["']([^"']+)["']/i);

      // 기존 속성 추출
      const widthMatch = match.match(/width=["']?(\d+)["']?/i);
      const heightMatch = match.match(/height=["']?(\d+)["']?/i);
      const altMatch = match.match(/alt=["']([^"']*)["']?/i);
      const styleMatch = match.match(/style=["']([^"']*)["']/i);

      const width = widthMatch ? widthMatch[1] : "1080";
      const height = heightMatch ? heightMatch[1] : "720";
      const alt = altMatch ? altMatch[1] : "게시글 이미지";
      const existingStyle = styleMatch ? styleMatch[1] : "";

      // src가 없는 이미지: alt만 확인하고 추가
      if (!srcMatch) {
        if (altMatch) return match;
        return match.replace(/<img/i, `<img alt="${alt}"`);
      }

      const src = srcMatch[1];
      const isExternalImage = src.startsWith("http://") || src.startsWith("https://");

      // 외부 이미지가 아닌 경우, alt만 추가하고 반환
      if (!isExternalImage) {
        // alt가 이미 있으면 원본 반환, 없으면 alt 추가
        if (altMatch) return match;
        return match.replace(/<img/i, `<img alt="${alt}"`);
      }

      // 외부 이미지: 전체 최적화 적용
      // 기존 스타일에 이미지 최적화 스타일 추가
      const mergedStyle = existingStyle
        ? `${existingStyle}; width:100%; height:auto;`
        : "width:100%; height:auto;";

      // 첫 번째 이미지는 eager loading, 나머지는 lazy loading
      const loading = isFirstImage ? "eager" : "lazy";
      const fetchpriority = isFirstImage ? "high" : "low";
      const currentIsFirst = isFirstImage;
      isFirstImage = false;

      // 최적화된 이미지 태그 생성
      return `<img src="${src}" alt="${alt}" width="${width}" height="${height}" style="${mergedStyle}" loading="${loading}" decoding="async" fetchpriority="${fetchpriority}" data-optimized="${currentIsFirst ? 'first' : 'lazy'}">`;
    }
  );
}
