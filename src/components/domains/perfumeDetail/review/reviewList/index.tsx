import { ButtonFilledGrayLFull } from "@/components/commons/button/ButtonFilled";
import { ReviewCard } from "./reviewCard";
import { SectionTitle } from "@/components/commons/sectionTitle";

const mockReviews = [
  {
    id: 1,
    author: "주현",
    createdAt: "2025.02.03",
    profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
    isMain: true,
    content: "짧은 리뷰입니다. 향이 좋아요!",
    tags: ["👍 최고예요!", "🌸 봄에 어울림"],
  },
  {
    id: 2,
    author: "윤지",
    createdAt: "2025.01.20",
    profileImage: "",
    isMain: false,
    content:
      "이 향수는 정말 오래가고 고급스러운 향이 납니다. 주변 사람들도 자주 물어보네요. 데일리로 쓰기에 딱입니다!",
    tags: [
      "👍 최고예요!",
      "⌛️ 긴 지속력 (6시간 이상)",
      "🍃 주변 사람들이 쉽게 느낄 수 있는 정도",
      "💰 가성비 좋아요",
    ],
  },
  {
    id: 3,
    author: "예빈",
    createdAt: "2024.12.15",
    profileImage: "https://i.ibb.co/TR0HqY4/image.jpg",
    isMain: false,
    content:
      "향은 괜찮지만 너무 금방 날아가서 아쉬웠어요. 패키지는 예뻐요. 가격대비는 조금 아쉽네요. 다음에는 다른 향수를 써보려구요. 그래도 선물용으로는 좋을 것 같아요. 디자인이 예쁘니까요. 향은 괜찮지만 너무 금방 날아가서 아쉬웠어요. 패키지는 예뻐요. 가격대비는 조금 아쉽네요. 다음에는 다른 향수를 써보려구요. 그래도 선물용으로는 좋을 것 같아요. 디자인이 예쁘니까요. 향은 괜찮지만 너무 금방 날아가서 아쉬웠어요. 패키지는 예뻐요. 가격대비는 조금 아쉽네요. 다음에는 다른 향수를 써보려구요. 그래도 선물용으로는 좋을 것 같아요. 디자인이 예쁘니까요.",
    tags: [
      "👍 괜찮아요",
      "⌛️ 짧은 지속력 (1시간 미만)",
      "🌃 밤에 더 잘 어울림",
      "🎁 선물용으로 좋아요",
      "🧴 패키지 예쁨",
      "💸 가격이 조금 아쉬움",
    ],
  },
];

export const ReviewList = () => {
  return (
    <section className="flex flex-col gap-5">
      <SectionTitle itemCount="587">리뷰</SectionTitle>
      <ul className="flex flex-col gap-6">
        {mockReviews.map((review) => (
          <li key={review.id}>
            <ReviewCard
              content={review.content}
              tags={review.tags}
              author={review.author}
              createdAt={review.createdAt}
              profileImage={review.profileImage}
              isMain={review.isMain}
            />
          </li>
        ))}
      </ul>
      <ButtonFilledGrayLFull>더보기</ButtonFilledGrayLFull>
    </section>
  );
};
