import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { DoughnutChart } from "./DoughnutChart";

const CATEGORY_LABEL_MAP = {
  feeling: [
    { key: "BEST", label: "최고예요", color: "#6F4D3F" },
    { key: "GOOD", label: "좋아요", color: "#A47764" },
    { key: "NEUTRAL", label: "괜찮아요", color: "#CB9C88" },
    { key: "BAD", label: "별로예요", color: "#DBC0B0" },
    { key: "DISLIKE", label: "싫어요", color: "#EAD8C4" },
  ],
  longevity: [
    { key: "LONG_LASTING", label: "긴 지속력 (6시간 이상)", color: "#6F4D3F" },
    { key: "MODERATE", label: "중간 (3-6시간)", color: "#A47764" },
    { key: "WEAK", label: "짧음 (1-3시간)", color: "#CB9C88" },
    { key: "VERY_WEAK", label: "매우 짧음 (1시간 미만)", color: "#EAD8C4" },
  ],
  pricePerception: [
    { key: "GOOD_VALUE", label: "가성비가 좋아요", color: "#6F4D3F" },
    { key: "REASONABLE", label: "적당해요", color: "#CB9C88" },
    { key: "EXPENSIVE", label: "비싸요", color: "#EAD8C4" },
  ],
  sillage: [
    { key: "STRONG", label: "멀리 퍼지는 향", color: "#6F4D3F" },
    { key: "MODERATE", label: "주변만 퍼지는 향", color: "#CB9C88" },
    { key: "INTIMATE", label: "자기만 느끼는 향", color: "#EAD8C4" },
  ],
};

const reviewAnalytics = (data: ReviewResponse[]) => {
  const countByCategory = (category: keyof typeof CATEGORY_LABEL_MAP) => {
    return CATEGORY_LABEL_MAP[category].map(({ key, label, color }) => ({
      label,
      count: data.filter((r) => r.chips[category] === key).length,
      color,
    }));
  };

  return [
    {
      category: "만족도",
      results: countByCategory("feeling"),
    },
    {
      category: "지속력",
      results: countByCategory("longevity"),
    },
    {
      category: "가격",
      results: countByCategory("pricePerception"),
    },
    {
      category: "잔향",
      results: countByCategory("sillage"),
    },
  ];
};

export const ReviewDoughnutSection = ({ data }: { data: ReviewResponse[] }) => {
  return (
    <section className="w-full p-9 rounded-xl shadow-card">
      <ul className="grid grid-cols-[max-content_1fr] gap-x-9 gap-y-9 w-full">
        {reviewAnalytics(data).map((item) => (
          <li key={item.category}>
            <DoughnutChart
              centerText={item.category}
              data={item.results.map((r) => ({
                label: r.label,
                value: r.count,
                color: r.color,
              }))}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
