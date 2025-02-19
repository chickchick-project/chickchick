import { NextResponse } from "next/server";
import { fetchSearch } from "@/lib/supabase/query/search";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchTerm = url.searchParams.get("q") || "";
  const limit = Number(url.searchParams.get("limit")) || 15;

  if (!searchTerm) {
    return NextResponse.json(
      { error: "검색어를 입력하세요." },
      { status: 400 }
    );
  }

  try {
    const data = await fetchSearch(searchTerm, limit);

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "검색 결과가 없습니다." },
        { status: 200 }
      );
    }
    /**
     * @typedef {Object} Perfume
     * @property {string} perfume_id - 향수의 고유 ID
     * @property {Object} perfume_name - 다국어 향수명 (예: { en: "Rose", kr: "로즈" })
     * @property {string} brand_id - 브랜드 ID
     * @property {Object} brand_name - 다국어 브랜드명 (예: { en: "Dior", kr: "디올" })
     * @property {string} image_url - 향수 이미지 URL
     * @property {number} priority - 검색 우선순위 (3: 향수 이름, 2: 노트, 1: 계열)
     */
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
