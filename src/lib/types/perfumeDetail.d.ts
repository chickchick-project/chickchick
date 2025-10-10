export type UUID = string;
export interface IPerfumeDetailResponse {
  success: boolean;
  message: string;
  data: IPerfumeDetail;
}

export interface IPerfumeDetail {
  id: UUID;
  nameEn: string;
  nameKo: string;
  brand: Brand;
  perfumeImage?: IPerfumeImage | null;
  accordMappings: IAccordMapping[];
  noteMappings: INoteMapping[];
  reviews: IReviewSummary[];
  _count: IPerfumeCount;
}

export interface IBrand {
  nameEn: string;
  nameKo: string;
}

export interface IPerfumeImage {
  imageUrl: string;
}

export interface IAccord {
  id: UUID;
  nameKo: string;
  nameEn: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAccordMapping {
  accord: IAccord;
}

export interface INote {
  id: UUID;
  nameKo: string;
  nameEn: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TNoteStage = string;

export interface INoteMapping {
  note: INote;
  noteStage: TNoteStage;
}

export interface IReviewAuthor {
  id: UUID;
  nickname: string;
  imageUrl: string | null;
}

export interface IReviewSummary {
  id: UUID;
  content: string;
  author: IReviewAuthor;
}

export interface IPerfumeCount {
  bookmarks: number;
  reviews: number;
  collectedByUsers: number;
}
