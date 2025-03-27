import { prisma } from "@/lib/prisma";

interface SearchParams {
  search_text: string;
  result_limit?: number;
  last_seen_id?: string;
}

interface SearchParamsWithFilters extends SearchParams {
  brand_filter: string;
  notes_filter: string[];
  accords_filter: string[];
}

/**
 * 단순 검색 함수 (GET 요청)
 */
export async function fetchSearch(params: SearchParams) {
  const { search_text, result_limit = 15, last_seen_id } = params;

  const data = await prisma.$queryRawUnsafe(
    "SELECT * FROM search_perfumes($1::text, $2::uuid[], $3::uuid[], $4::uuid[], $5::uuid, $6::integer)",
    search_text,
    null,
    null,
    null,
    last_seen_id,
    result_limit
  );

  return data;
}
/**
 * 필터 포함 검색 함수 (POST 요청)
 */
export async function fetchSearchWithFilters(params: SearchParamsWithFilters) {
  const {
    search_text,
    brand_filter,
    notes_filter,
    accords_filter,
    last_seen_id,
    result_limit,
  } = params;

  const formattedNotes =
    Array.isArray(notes_filter) && notes_filter.length > 0
      ? notes_filter
      : null;
  const formattedAccords =
    Array.isArray(accords_filter) && accords_filter.length > 0
      ? accords_filter
      : null;

  try {
    const data = await prisma.$queryRawUnsafe(
      "SELECT * FROM search_perfumes($1::text, $2::uuid[], $3::uuid[], $4::uuid[], $5::uuid, $6::integer)",
      search_text,
      brand_filter || null,
      formattedNotes,
      formattedAccords,
      last_seen_id || null,
      result_limit ?? 15
    );

    if (!data) {
      console.error("Prisma query returned null data");
      throw new Error("No data found");
    }

    return data;
  } catch (error) {
    console.error("Prisma Query Error:", error);
    throw new Error(`Database query failed: ${(error as Error).message}`);
  }
}

/**
 * last_seen_id가 실제로 존재하는지 확인하는 함수
 */
export async function checkPerfumeExists(perfumeId: string) {
  const perfume = await prisma.perfumes.findUnique({
    where: { id: perfumeId },
    select: { id: true },
  });

  return Boolean(perfume);
}
