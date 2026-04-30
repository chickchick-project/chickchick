import type { SupabasePerfume } from "../../../schemas/search.schema";

// 테스트용 공통 데이터 헬퍼 함수
export const getTestData = () => {
  const TEST_PERFUME_ID = "123e4567-e89b-12d3-a456-426614174000";
  const TEST_BRAND_ID = "223e4567-e89b-12d3-a456-426614174001";

  const mockSupabasePerfume: SupabasePerfume = {
    perfume_id: TEST_PERFUME_ID,
    perfume_name_en: "Test Perfume",
    perfume_name_ko: "테스트 향수",
    brand_id: TEST_BRAND_ID,
    brand_name_en: "Test Brand",
    brand_name_ko: "테스트 브랜드",
    brand_url: "test-brand",
    image_url: "https://example.com/perfume.jpg",
    priority: 100,
    gender_vote_count: 0,
  };

  const mockSupabasePerfumes = (count: number): SupabasePerfume[] =>
    Array.from({ length: count }, (_, i) => ({
      perfume_id: `perfume-${i}`,
      perfume_name_en: `Test Perfume ${i}`,
      perfume_name_ko: `테스트 향수 ${i}`,
      brand_id: TEST_BRAND_ID,
      brand_name_en: "Test Brand",
      brand_name_ko: "테스트 브랜드",
      brand_url: "test-brand",
      image_url: `https://example.com/perfume-${i}.jpg`,
      priority: 100 - i,
      gender_vote_count: 0,
    }));

  return {
    ids: {
      perfumeId: TEST_PERFUME_ID,
      brandId: TEST_BRAND_ID,
    },
    mockSupabasePerfume,
    mockSupabasePerfumes,
  };
};
