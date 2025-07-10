import { Review, CreateReview } from "../schemas/review.schema";

const fakeDb: Review[] = [];

export async function createReviewService(
  newReview: CreateReview
): Promise<Review> {
  const createdReview: Review = {
    ...newReview,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  fakeDb.push(createdReview);

  console.log(fakeDb);
  return createdReview;
}

export async function getReviewService(
  perfumeId: string
): Promise<Review | null> {
  const review = fakeDb.find((u) => u.id === perfumeId);
  return review || null;
}
