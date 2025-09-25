import { InfoType } from "../../author/author.types";

interface Author {
  id: string;
  nickname: string;
  imageUrl: string;
}

export interface ReviewCardProps {
  brand: string;
  title: string;
  review: string;
  createdAt: Date;
  info: InfoType;
  chips: Array<string>;
  imageUrl?: string;
  isMyPage: boolean;
  isAuthor: boolean;
  author: Author;
}
