import ICONS from "@/lib/constants/icons";

export const REVIEW_OPTIONS = {
  status: [
    { key: "OWN", label: "지금 갖고 있어요" },
    { key: "USED", label: "써봤어요" },
    { key: "WANT", label: "갖고싶어요" },
  ],
  feeling: [
    {
      key: "DISLIKE",
      label: "싫어요",
      image: { src: ICONS.DislikeGray.src, alt: ICONS.DislikeGray.alt },
      image_selected: {
        src: ICONS.DislikePrimary.src,
        alt: ICONS.DislikePrimary.alt,
      },
    },
    {
      key: "BAD",
      label: "별로에요",
      image: { src: ICONS.BadGray.src, alt: ICONS.BadGray.alt },
      image_selected: {
        src: ICONS.BadPrimary.src,
        alt: ICONS.BadPrimary.alt,
      },
    },
    {
      key: "NEUTRAL",
      label: "괜찮아요",
      image: { src: ICONS.NeutralGray.src, alt: ICONS.NeutralGray.alt },
      image_selected: {
        src: ICONS.NeutralPrimary.src,
        alt: ICONS.NeutralPrimary.alt,
      },
    },
    {
      key: "GOOD",
      label: "좋아요",
      image: { src: ICONS.GoodGray.src, alt: ICONS.GoodGray.alt },
      image_selected: {
        src: ICONS.GoodPrimary.src,
        alt: ICONS.GoodPrimary.alt,
      },
    },
    {
      key: "BEST",
      label: "최고에요!",
      image: { src: ICONS.BestGray.src, alt: ICONS.BestGray.alt },
      image_selected: {
        src: ICONS.BestPrimary.src,
        alt: ICONS.BestPrimary.alt,
      },
    },
  ],
  lasting: [
    { key: "VERY_SHORT", label: "매우 짧음 (1시간 미만)" },
    { key: "SHORT", label: "짧음 (1-3시간)" },
    { key: "MEDIUM", label: "중간 (3-6시간)" },
    { key: "LONG", label: "긴 지속력 (6시간 이상)" },
  ],
  sillage: [
    { key: "LOW", label: "자신만 느낄 수 있는 정도" },
    { key: "MEDIUM", label: "가까이 있는 사람이 느낄 수 있는 정도" },
    { key: "HIGH", label: "주변 사람들이 쉽게 느낄 수 있는 정도" },
  ],
  gender_tone: [
    { key: "FEMININE", label: "여성적인" },
    { key: "NEUTRAL", label: "중성적인" },
    { key: "MASCULINE", label: "남성적인" },
  ],
  seasonal: [
    { key: "SPRING", label: "봄" },
    { key: "SUMMER", label: "여름" },
    { key: "FALL", label: "가을" },
    { key: "WINTER", label: "겨울" },
  ],
  time: [
    { key: "DAY", label: "낮" },
    { key: "NIGHT", label: "밤" },
  ],
  price: [
    { key: "EXPENSIVE", label: "비싸요" },
    { key: "REASONABLE", label: "적당해요" },
    { key: "VALUE", label: "가성비가 좋아요" },
  ],
};
