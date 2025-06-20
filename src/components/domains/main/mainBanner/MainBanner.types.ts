export type BannerPerfumeCardType = {
  id: string;
  imageUrl: string | null;
  brand: {
    id: string;
    nameKo: string | null;
    nameEn: string;
  };
  nameKo: string | null;
  nameEn: string;
};
