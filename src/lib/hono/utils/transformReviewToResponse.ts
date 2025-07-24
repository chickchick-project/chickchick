import { Review, User } from "@prisma/client";
import { ReviewResponse } from "../schemas/review.schema";

type ReviewWithAuthor = Review & {
  author: Pick<User, "id" | "nickname" | "imageUrl">;
};

export function transformReviewToResponse(
  review: ReviewWithAuthor
): ReviewResponse {
  return {
    id: review.id,
    usageStatus: review.usageStatus,
    content: review.content,
    createdAt: review.createdAt,
    author: {
      id: review.author.id,
      nickname: review.author.nickname,
      imageUrl: review.author.imageUrl,
    },
    chips: {
      rating: review.rating,
      longevity: review.longevity,
      sillage: review.sillage,
      genderProfile: review.genderProfile,
      season: review.season,
      timeOfDay: review.timeOfDay,
      pricePerception: review.pricePerception,
    },
  };
}
