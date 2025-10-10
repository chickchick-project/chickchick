import ICONS from "@/lib/constants/icons";
import { REVIEW_STATUSES, SIZE_STATUSES } from "./author.constants";
import { PerfumeUsageStatus } from "@prisma/client";
interface Author {
  id: string;
  nickname: string;
  imageUrl: string | null;
}

export type ReviewStatusType =
  (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];
export type SizeStatusType = (typeof SIZE_STATUSES)[keyof typeof SIZE_STATUSES];

interface BaseInfo<T extends string, I = undefined> {
  type: T;
  item?: I;
}

export interface PostMetaItem {
  type: "Like" | "Comment" | "View";
  count: number;
}
type BasicInfo = BaseInfo<"basic", undefined>;
type PostInfo = BaseInfo<"post", PostMetaItem[]>;
type ReviewInfo = BaseInfo<"review", { status: PerfumeUsageStatus }>;
type CommentInfo = BaseInfo<"comment", undefined>;

export type InfoType = PostInfo | ReviewInfo | CommentInfo | BasicInfo;

export interface AuthorInfoProps {
  size?: SizeStatusType;
  author: Author;
  createdAt: Date;
  isAuthor: boolean;
  info?: InfoType;
}

type AllowedIcons = Partial<Pick<typeof ICONS, "Like" | "Comment" | "View">>;

export interface PostMetaItem {
  type: keyof AllowedIcons;
  count: number;
}
