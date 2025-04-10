import { PERFUME_CARD_TYPES } from "./perfumeCard.constants";

type PerfumeCardType =
  (typeof PERFUME_CARD_TYPES)[keyof typeof PERFUME_CARD_TYPES];

interface PerfumeCardProps {
  cardType?: PerfumeCardType;
  perfumeImage: string;
  brandName: string;
  perfumeName: string;
  onClick?: () => void;
  onClose?: () => void;
}

export { type PerfumeCardType, type PerfumeCardProps };
