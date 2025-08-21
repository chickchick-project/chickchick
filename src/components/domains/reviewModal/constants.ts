import ICONS from "@/lib/constants/icons";

export const REVIEW_OPTIONS = {
  status: [
    {
      key: "NOT_USED_YET",
      label: "아직 안 써봤어요",
      tag: "🙅 아직 안 써봤어요",
    },
    {
      key: "CURRENTLY_USING",
      label: "지금 쓰고 있어요",
      tag: "🤔 지금 쓰고 있어요",
    },
    { key: "USED_BEFORE", label: "써봤어요", tag: "👌 써봤어요" },
  ],
  feeling: [
    {
      key: "DISLIKE",
      label: "싫어요",
      tag: "😞 싫어요",
      image: { src: ICONS.DislikeGray.src, alt: ICONS.DislikeGray.alt },
      image_selected: {
        src: ICONS.DislikePrimary.src,
        alt: ICONS.DislikePrimary.alt,
      },
    },
    {
      key: "BAD",
      label: "별로에요",
      tag: "😕 별로에요",
      image: { src: ICONS.BadGray.src, alt: ICONS.BadGray.alt },
      image_selected: {
        src: ICONS.BadPrimary.src,
        alt: ICONS.BadPrimary.alt,
      },
    },
    {
      key: "NEUTRAL",
      label: "괜찮아요",
      tag: "😐 괜찮아요",
      image: { src: ICONS.NeutralGray.src, alt: ICONS.NeutralGray.alt },
      image_selected: {
        src: ICONS.NeutralPrimary.src,
        alt: ICONS.NeutralPrimary.alt,
      },
    },
    {
      key: "GOOD",
      label: "좋아요",
      tag: "🙂 좋아요",
      image: { src: ICONS.GoodGray.src, alt: ICONS.GoodGray.alt },
      image_selected: {
        src: ICONS.GoodPrimary.src,
        alt: ICONS.GoodPrimary.alt,
      },
    },
    {
      key: "BEST",
      label: "최고에요!",
      tag: "😍 최고에요!",
      image: { src: ICONS.BestGray.src, alt: ICONS.BestGray.alt },
      image_selected: {
        src: ICONS.BestPrimary.src,
        alt: ICONS.BestPrimary.alt,
      },
    },
  ],
  longevity: [
    { key: "VERY_WEAK", label: "매우 짧음 (1시간 미만)", tag: "⏱️ 매우 짧음" },
    { key: "WEAK", label: "짧음 (1-3시간)", tag: "⏱️ 짧음 (1-3시간)" },
    { key: "MODERATE", label: "중간 (3-6시간)", tag: "⏱️ 중간 (3-6시간)" },
    {
      key: "LONG_LASTING",
      label: "긴 지속력 (6시간 이상)",
      tag: "⏱️ 긴 지속력 (6시간 이상)",
    },
  ],
  sillage: [
    {
      key: "INTIMATE",
      label: "자신만 느낄 수 있는 정도",
      tag: "👤 자신만 느낄 수 있는 정도",
    },
    {
      key: "MODERATE",
      label: "가까이 있는 사람이 느낄 수 있는 정도",
      tag: "👥 가까이 있는 사람이 느낄 수 있는 정도",
    },
    {
      key: "STRONG",
      label: "주변 사람들이 쉽게 느낄 수 있는 정도",
      tag: "🍃 주변 사람들이 쉽게 느낄 수 있는 정도",
    },
  ],
  genderTone: [
    { key: "FEMININE", label: "여성적인", tag: "👩 여성적인" },
    { key: "UNISEX", label: "중성적인", tag: "⚖️ 중성적인" },
    { key: "MASCULINE", label: "남성적인", tag: "👨 남성적인" },
  ],
  season: [
    { key: "SPRING", label: "봄", tag: "🌸 봄" },
    { key: "SUMMER", label: "여름", tag: "☀️ 여름" },
    { key: "AUTUMN", label: "가을", tag: "🍂 가을" },
    { key: "WINTER", label: "겨울", tag: "❄️ 겨울" },
  ],
  timeOfDay: [
    { key: "DAY", label: "낮", tag: "🌞 낮" },
    { key: "NIGHT", label: "밤", tag: "🌜 밤" },
  ],
  pricePerception: [
    { key: "EXPENSIVE", label: "비싸요", tag: "💸 비싸요" },
    { key: "REASONABLE", label: "적당해요", tag: "💰 적당해요" },
    { key: "GOOD_VALUE", label: "가성비가 좋아요", tag: "💵 가성비가 좋아요" },
  ],
};
