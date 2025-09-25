import { PERFUME_CARD_TYPES } from "./perfumeCard.constants";
import { SimpleCardProps, CardImageProps } from "../card.types";

export type PerfumeCardType =
  (typeof PERFUME_CARD_TYPES)[keyof typeof PERFUME_CARD_TYPES];

export interface PerfumeCardProps
  extends SimpleCardProps,
    Pick<CardImageProps, "perfumeImage"> {
  cardType: PerfumeCardType;
  brandName: string | null;
  perfumeName: string | null;
}
