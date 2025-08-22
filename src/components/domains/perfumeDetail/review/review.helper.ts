import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { REVIEW_OPTIONS } from "../../reviewModal/constants";

export async function getReviewData(id: string): Promise<ReviewResponse[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/v1/reviews/${id}`, {
      cache: "no-store",
      next: {
        tags: ["review", `perfume-${id}`],
      },
    });

    const { data } = await res.json();
    if (!res.ok) {
      console.error("Failed to fetch review data:", res.statusText);
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error in getReviewData:", error);
    return [];
  }
}

export type ReviewCategory = keyof typeof REVIEW_OPTIONS;

export function getLabelByKey(category: ReviewCategory, key: string) {
  const option = REVIEW_OPTIONS[category];
  if (!option) return key;

  const found = option.find((item: { key: string }) => item.key === key);
  return found ? found.tag : key;
}
