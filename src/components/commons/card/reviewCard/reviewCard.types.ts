import { InfoType } from "../../author/author.types";
import { CardWithImageProps } from "../card.types";

export interface ReviewCardProps extends CardWithImageProps {
  brand: string;
  title: string;
  review: string;
  info: InfoType;
  chips: string[];
  isMyPage: boolean;
}
