import ReviewCard from "@/components/commons/card/reviewCard";
import { fetchPopularReviews } from "../main.helper";
import Link from "next/link";

export const MainContentReview = async () => {
  const review = await fetchPopularReviews();
  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full pc:px-0 px-4 ">
      <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        인기 리뷰
      </div>
      <div className="w-full flex items-start tablet:justify-center">
        <Link href={`/perfumes/${review!.data.perfume.id}`}>
          <ReviewCard review={review!.data} isMyPage={false} isAuthor={false} />
        </Link>
      </div>
    </div>
  );
};
