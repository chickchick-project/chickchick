import { useEffect } from "react";

interface UseBeforeUnloadOptions {
  enabled: boolean;
}

/**
 * 페이지 이탈/새로고침 시 브라우저 경고를 표시하는 훅
 *
 * @param enabled - 경고 활성화 여부
 */
export function useBeforeUnload({ enabled }: UseBeforeUnloadOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
