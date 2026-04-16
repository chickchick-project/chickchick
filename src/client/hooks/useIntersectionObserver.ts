import { useCallback, useRef, useState } from "react";

export function useIntersectionObserver(threshold: number = 0.1) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const callbackRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setIsIntersecting(entry.isIntersecting));
        },
        { threshold }
      );
      observerRef.current.observe(node);
    },
    [threshold]
  );

  return { ref: callbackRef, isIntersecting };
}
