export const extractFirstImageSrc = (html: string): string | null => {
  if (typeof window === "undefined") return null;
  const doc = new window.DOMParser().parseFromString(html, "text/html");
  const img = doc.querySelector("img");
  return img ? img.getAttribute("src") : null;
};
