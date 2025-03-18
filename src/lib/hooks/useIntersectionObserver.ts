import { useEffect, useState } from "react";

export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  threshold: number = 0.1
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const targetElement = ref.current;

    if (!targetElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold }
    );

    observer.observe(targetElement);

    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [ref, threshold]);

  return isVisible;
}
