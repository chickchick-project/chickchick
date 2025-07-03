export type PerfumeCardType = {
  id: string;
  nameEn: string;
  nameKo: string | null;
  brand: {
    id: string;
    nameEn: string;
    nameKo: string | null;
  };
  perfumeImage: {
    image_url: string;
  } | null;
};
