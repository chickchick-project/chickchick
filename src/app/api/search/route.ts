import { NextResponse } from "next/server";
import { fetchSearch, checkPerfumeExists } from "@/lib/supabase/query/search";

interface Perfume {
  perfume_id: string; // 향수의 고유 ID
  perfume_name: { en: string; kr?: string }; // 다국어 향수명 (예: { en: "Rose", kr: "로즈" })
  brand_id: string; // 브랜드 ID
  brand_name: { en: string; kr?: string }; // 다국어 브랜드명 (예: { en: "Dior", kr: "디올" })
  image_url: string; // 향수 이미지 URL
  priority: number; // 검색 우선순위 (4: 향수 이름, 3: 브랜드, 2: 노트, 1: 계열)
}

interface SearchResponse {
  data: Perfume[]; // 검색된 향수 목록
  nextCursor: { last_seen_id: string } | null; // 다음 페이지를 위한 커서 (없으면 null)
}

/**
 * UUID 유효성 검사 함수
 * - 유효한 UUID 형식인지 확인
 */
function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * 검색 API 핸들러 (GET 요청)
 * - 검색어(q)와 페이지네이션(limit, last_seen_id)을 받아 향수 목록을 반환
 * - 유효하지 않은 last_seen_id 또는 존재하지 않는 ID는 400 에러 반환
 */
export async function GET(req: Request): Promise<NextResponse<SearchResponse>> {
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get("q") || ""; // 검색어
  const limit = Number(url.searchParams.get("limit")) || 15; // 한 번에 가져올 데이터 개수
  const lastId = url.searchParams.get("last_seen_id") || undefined; // 마지막으로 확인한 향수 ID (커서)

  // last_seen_id가 유효한 UUID인지 확인
  if (lastId && !validateUUID(lastId)) {
    return NextResponse.json(
      {
        data: [],
        nextCursor: null,
        error: "요청을 처리할 수 없습니다. 입력한 데이터를 확인해주세요.",
      },
      { status: 400 }
    );
  }

  // last_seen_id가 실제로 존재하는 ID인지 확인
  if (lastId) {
    const exists = await checkPerfumeExists(lastId);
    if (!exists) {
      return NextResponse.json(
        {
          data: [],
          nextCursor: null,
          error: "요청을 처리할 수 없습니다. 입력한 데이터를 확인해주세요.",
        },
        { status: 400 }
      );
    }
  }

  // 검색어가 없는 경우 빈 데이터 반환
  if (!searchTerm) {
    return NextResponse.json({ data: [], nextCursor: null }, { status: 200 });
  }

  try {
    // 검색 수행 (Supabase RPC 호출)
    const data: Perfume[] = await fetchSearch(searchTerm, limit, lastId);

    // 검색 결과가 없을 경우 빈 데이터 반환
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ data: [], nextCursor: null }, { status: 200 });
    }

    // limit + 1 개를 가져와서 다음 페이지 존재 여부 확인
    const hasNextPage = data.length > limit;
    const trimmedData = hasNextPage ? data.slice(0, limit) : data; // 초과 데이터 제거

    // 다음 페이지 커서 설정 (마지막 아이템의 ID)
    const nextCursor = hasNextPage
      ? { last_seen_id: trimmedData[trimmedData.length - 1].perfume_id }
      : null;

    // 우선순위(priority) 기준 정렬 후, 같은 우선순위에서는 ID 순 정렬
    data.sort((a, b) =>
      b.priority !== a.priority
        ? b.priority - a.priority
        : a.perfume_id.localeCompare(b.perfume_id)
    );

    return NextResponse.json(
      { data: trimmedData, nextCursor },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], nextCursor: null, error: (error as Error).message },
      { status: 500 }
    );
  }
}
