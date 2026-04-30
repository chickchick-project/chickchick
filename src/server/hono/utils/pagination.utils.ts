/**
 * 페이지네이션 API가 클라이언트에 반환할 표준 결과 객체의 타입.
 * @template T - 페이지네이션될 데이터의 타입
 */
export interface PaginationResult<T> {
  data: T[]; // 현재 페이지의 데이터 배열
  totalCount: number; // 필터 조건에 맞는 전체 아이템 수
  nextCursor: string | null; // 다음 페이지를 요청할 때 사용할 커서 ID (없으면 null)
}

/**
 * 커서 기반 페이지네이션의 결과를 생성하는 헬퍼 함수.
 * DB에서 'limit + 1'개 만큼 데이터를 조회한 후 이 함수를 호출합니다.
 *
 * @template T - 데이터의 타입. 반드시 'id' 속성을 포함해야 합니다.
 * @param data - DB에서 조회된 데이터 배열 (요청된 limit + 1개)
 * @param totalCount - 조건에 맞는 전체 아이템의 수
 * @param limit - 클라이언트가 한 페이지에 받기를 원하는 아이템의 수
 * @returns 페이지네이션 정보가 포함된 최종 결과 객체
 */
export function createCursorPaginationResult<T extends { id: string }>(
  data: T[],
  totalCount: number,
  limit: number
): PaginationResult<T> {
  const hasMore = data.length > limit;
  const resultData = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore
    ? resultData[resultData.length - 1]?.id ?? null
    : null;

  return {
    data: resultData,
    totalCount,
    nextCursor,
  };
}
