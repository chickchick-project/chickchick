/* eslint-disable @typescript-eslint/no-explicit-any */
import ReviewCard from "@/components/commons/card/reviewCard";
import { PostCard } from "@/components/commons/card/postCard";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { mockReviewCardData } from "@/lib/mocks/reviewCard";
import { mockPerfumeCardData } from "@/lib/mocks/perfumeCard";
import { mockReplyData } from "@/lib/mocks/reply";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import Reply from "../../Reply";
import Link from "next/link";

//TODO: Mock Data를 실제 데이터로 변경하는 작업이 필요함.
export const renderMyReviews = (reviews: any[]) =>
  reviews.length > 0 ? (
    <ul className="space-y-2">
      {reviews.map((item) => (
        <ReviewCard key={item.id} {...mockReviewCardData} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 리뷰가 없습니다.
    </div>
  );

export const renderMyPosts = (posts: any[]) =>
  posts.length > 0 ? (
    <ul className="space-y-2">
      {posts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            {...mockPostCardData}
            isAuthor={false}
            isCategory={true}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      작성한 게시글이 없습니다.
    </div>
  );

export const renderMyComments = (comments: any[]) => (
  <ul className="space-y-2">
    {comments.map((item, idx) => (
      <Reply
        key={item.id}
        {...mockReplyData}
        postInfo={{
          id: item.postId.toString(),
          title: "[서울 동대문구]올리브영 향수 나눔합니다!",
        }}
        isLast={idx === comments.length - 1}
      />
    ))}
  </ul>
);

export const renderLikedPerfumes = (likedPerfumes: any[]) =>
  likedPerfumes.length > 0 ? (
    <ul className="grid grid-cols-5 gap-4">
      {likedPerfumes.map((item) => (
        <PerfumeCard key={item.id} {...mockPerfumeCardData} />
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 향수가 없습니다.
    </div>
  );

export const renderLikedPosts = (likedPosts: any[]) =>
  likedPosts.length > 0 ? (
    <ul className="space-y-2">
      {likedPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            {...mockPostCardData}
            isAuthor={false}
            isCategory={true}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );
