// import { Review } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";

/** @deprecated 더 이상 사용되지 않음. 기존 함수 대신 직접 fetch로 /api/v1/reviews/:perfumeId 엔드포인트를 호출함. */

// export const createReview = async (props: Review) => {
//   console.log("리뷰 생성:", props);
//   try {
//     const response = await fetch(`/api/v1/reviews/${props.perfumeId}`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         id: uuidv4(),
//         authorId: props.authorId,
//         perfumeId: props.perfumeId,
//         usageStatus: props.usageStatus,
//         content: props.content,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error);
//     }

//     const result = await response.json();
//     console.log("리뷰 생성 성공:", result);
//     return result;
//   } catch (error) {
//     console.error("리뷰 생성 실패:", error);
//   }
// };
