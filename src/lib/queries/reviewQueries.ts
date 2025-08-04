import { Review } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const createReview = async (props: Review) => {
  try {
    const response = await fetch(`/api/perfumes/${props.perfumeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: uuidv4(),

        content: props.content,
        author_id: props.authorId,
        perfume_id: props.perfumeId,
        usage_status: props.usageStatus,
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
