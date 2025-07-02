import { Review } from "@prisma/client";

export const createReview = async (props: Review) => {
  try {
    const response = await fetch(`/api/perfumes/${props.perfumeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id,
        title: props.title,
        content: props.content,
        author_id: props.authorId,
        perfume_id: props.perfumeId,
        usage_status: props.usageStatus,
        tags: props.tags,
        image_url: props.imageUrl ?? null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const result = await response.json();
    console.log("리뷰 생성 성공:", result);
    return result;
  } catch (error) {
    console.error("리뷰 생성 실패:", error);
  }
};
