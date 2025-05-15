import { InfoType } from "../../author/author.types";

export interface ReviewCardProps {
  brand: string;
  title: string;
  review: string;
  createdAt: string;
  info: InfoType;
  chips: Array<string>;
  imageUrl?: string;
  isMyPage: boolean;
  isAuthor: boolean;
  author: string;
}
