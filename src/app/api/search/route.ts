import { NextResponse } from "next/server";
import {
  fetchSearch,
  fetchSearchWithFilters,
  checkPerfumeExists,
} from "@/lib/queries/searchQueries";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";

export interface Perfume {
  perfume_id: string; // 향수의 고유 ID
  perfume_name: { en: string; kr?: string }; // 다국어 향수명 (예: { en: "Rose", kr: "로즈" })
  brand_id: string; // 브랜드 ID
  brand_name: { en: string; kr?: string }; // 다국어 브랜드명 (예: { en: "Dior", kr: "디올" })
  image_url: string; // 향수 이미지 URL
  priority: number; // 검색 우선순위 (100: 향수 이름(Name), 80: 브랜드(Brand), 60: 노트(Note), 40: 계열(Accord))
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
export async function GET(
  req: Request
): Promise<NextResponse<SearchResponse<Perfume>>> {
  const url = new URL(req.url);
  const search_text = url.searchParams.get("q") || ""; // 검색어
  const result_limit = Number(url.searchParams.get("limit")) || 15; // 한 번에 가져올 데이터 개수
  const last_seen_id = url.searchParams.get("cursor") || undefined; // 마지막으로 확인한 향수 ID (커서)

  // last_seen_id가 유효한 UUID인지 확인
  if (last_seen_id && !validateUUID(last_seen_id)) {
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
  if (last_seen_id) {
    const exists = await checkPerfumeExists(last_seen_id);
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

  try {
    // 검색 수행 (Supabase RPC 호출)
    const [data, total] = (await fetchSearch({
      search_text,
      last_seen_id,
      result_limit: result_limit + 1,
    })) as Perfume[];

    // 검색 결과가 없을 경우 빈 데이터 반환
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({ data: [], nextCursor: null }, { status: 200 });
    }

    // limit + 1 개를 가져와서 다음 페이지 존재 여부 확인
    const hasNextPage = data.length > result_limit;
    const trimmedData = hasNextPage ? data.slice(0, result_limit) : data; // 초과 데이터 제거

    // 다음 페이지 커서 설정 (마지막 아이템의 ID)
    const nextCursor = hasNextPage
      ? trimmedData[trimmedData.length - 1].perfume_id
      : null;

    const totalCount =
      Array.isArray(total) && total[0]?.search_perfumes_total
        ? total[0].search_perfumes_total
        : 0;

    return NextResponse.json(
      { data: trimmedData, nextCursor, totalCount },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: [], nextCursor: null, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 검색 API 핸들러 (POST 요청)
 * - 검색어(search_text), 필터(brand_filter, notes_filter, accords_filter), 페이지네이션(limit, last_seen_id)을 받아 향수 목록을 반환
 * - 커서 기반 페이지네이션을 적용하여 `last_seen_id` 이후 데이터를 불러옴
 */
export async function POST(
  req: Request
): Promise<NextResponse<SearchResponse<Perfume>>> {
  try {
    // 요청 바디에서 필요한 파라미터 추출
    const {
      search_text, // 검색어
      brand_filter, // 브랜드 필터 (UUID)
      notes_filter, // 노트 필터 (TEXT[])
      accords_filter, // 어코드 필터 (TEXT[])
      last_seen_id, // 마지막으로 확인한 향수 ID (커서)
      result_limit = 15, // 한 번에 가져올 데이터 개수 (기본값 15)
    } = await req.json();

    if (last_seen_id) {
      const exists = await checkPerfumeExists(last_seen_id);
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

    // Supabase RPC 호출을 통해 검색 수행
    // - limit + 1 개를 가져와서 다음 페이지 여부 확인
    const [data, total] = await fetchSearchWithFilters({
      search_text,
      brand_filter,
      notes_filter,
      accords_filter,
      last_seen_id,
      result_limit: result_limit + 1, // 다음 페이지 확인을 위해 1개 더 가져옴
    });

    // 검색 결과가 없는 경우 빈 데이터 반환
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        {
          data: [],
          nextCursor: null,
        },
        { status: 200 }
      );
    }

    // limit 개수만큼 데이터 반환, 추가 데이터가 있다면 다음 페이지 존재 여부 설정
    const hasNextPage = data.length > result_limit;
    const trimmedData = hasNextPage ? data.slice(0, result_limit) : data;

    // 다음 페이지 커서 설정 (마지막 아이템의 ID)
    const nextCursor = hasNextPage
      ? trimmedData[trimmedData.length - 1].perfume_id
      : null;

    const totalCount =
      Array.isArray(total) && total[0]?.search_perfumes_total
        ? total[0].search_perfumes_total
        : 0;

    return NextResponse.json(
      { data: trimmedData, nextCursor, totalCount },
      { status: 200 }
    );
  } catch (error) {
    // 서버 에러 발생 시 500 응답 반환
    return NextResponse.json(
      { data: [], nextCursor: null, error: (error as Error).message },
      { status: 500 }
    );
  }
}
